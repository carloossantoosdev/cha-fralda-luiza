import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { DIAPER_SIZES, type DiaperSize, type RsvpInput, type RsvpResult } from './types'

const FALLBACK_MESSAGE =
  'Qualquer tamanho P ou M também ajuda, se o indicado estiver difícil de encontrar.'

const TARGETS = { P: 5, M: 7, G: 5 } as const

export class RsvpError extends Error {
  code: 'config' | 'duplicate' | 'validation' | 'network'

  constructor(
    message: string,
    code: 'config' | 'duplicate' | 'validation' | 'network',
  ) {
    super(message)
    this.name = 'RsvpError'
    this.code = code
  }
}

type Counts = Record<DiaperSize, number>

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function isDiaperSize(value: unknown): value is DiaperSize {
  return typeof value === 'string' && DIAPER_SIZES.includes(value as DiaperSize)
}

async function identityId(name: string, phone: string) {
  const bytes = new TextEncoder().encode(`${name}|${phone}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function emptyCounts(): Counts {
  return { P: 0, M: 0, G: 0 }
}

function pickSize(counts: Counts): DiaperSize {
  const deficit = {
    P: TARGETS.P - counts.P,
    M: TARGETS.M - counts.M,
    G: TARGETS.G - counts.G,
  }
  const ranked: DiaperSize[] = ['M', 'G', 'P']
  return ranked.reduce((best, size) => (deficit[size] > deficit[best] ? size : best))
}

function toResult(
  id: string,
  data: Record<string, unknown>,
  alreadyConfirmed: boolean,
): RsvpResult {
  if (!isDiaperSize(data.diaperSize)) {
    throw new RsvpError(
      'A confirmação foi enviada, mas a resposta veio incompleta. Fale com os pais para confirmar o tamanho.',
      'network',
    )
  }
  const quotaFallback = Boolean(data.quotaFallback)
  return {
    id,
    guestName: String(data.guestName ?? ''),
    diaperSize: data.diaperSize,
    quotaFallback,
    fallbackMessage: quotaFallback ? FALLBACK_MESSAGE : null,
    alreadyConfirmed,
  }
}

function ensureDb() {
  if (!isFirebaseConfigured || !db) {
    throw new RsvpError(
      'O formulário ainda não está ligado ao Firebase. Configure o projeto e a chave do app.',
      'config',
    )
  }
  return db
}

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  const database = ensureDb()
  const guestName = normalizeName(input.guestName)
  const phone = digitsOnly(input.phone)
  const notes = input.notes.trim()

  if (guestName.length < 3 || guestName.length > 120) {
    throw new RsvpError('Confira os campos e tente novamente.', 'validation')
  }
  if (phone.length < 10 || phone.length > 13) {
    throw new RsvpError('Confira os campos e tente novamente.', 'validation')
  }
  if (notes.length > 500) {
    throw new RsvpError('Confira os campos e tente novamente.', 'validation')
  }

  const id = await identityId(guestName, phone)
  const rsvpRef = doc(database, 'rsvps', id)
  const countsRef = doc(database, 'meta', 'counts')

  try {
    return await runTransaction(database, async (transaction) => {
      const existing = await transaction.get(rsvpRef)
      if (existing.exists()) return toResult(id, existing.data(), true)

      const countsSnap = await transaction.get(countsRef)
      const counts = countsSnap.exists()
        ? { ...emptyCounts(), ...(countsSnap.data() as Partial<Counts>) }
        : emptyCounts()
      const diaperSize = pickSize(counts)
      const quotaFallback = TARGETS[diaperSize] - counts[diaperSize] <= 0
      const nextCounts = { ...counts, [diaperSize]: counts[diaperSize] + 1 }

      transaction.set(rsvpRef, {
        guestName,
        phone,
        adultsCount: 1,
        notes,
        diaperSize,
        quotaFallback,
        createdAt: serverTimestamp(),
      })
      transaction.set(countsRef, nextCounts)

      return toResult(id, { guestName, diaperSize, quotaFallback }, false)
    })
  } catch (error) {
    if (error instanceof RsvpError) throw error
    throw new RsvpError(
      'Não conseguimos enviar agora. Verifique a conexão e tente de novo.',
      'network',
    )
  }
}

export async function refreshSavedRsvp(id: string): Promise<RsvpResult | null> {
  const database = ensureDb()
  try {
    const snapshot = await getDoc(doc(database, 'rsvps', id))
    if (!snapshot.exists()) return null
    return toResult(id, snapshot.data(), true)
  } catch {
    throw new RsvpError('Não conseguimos conferir a confirmação agora.', 'network')
  }
}
