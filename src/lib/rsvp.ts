import { isSupabaseConfigured, supabase } from './supabase'
import { DIAPER_SIZES, type DiaperSize, type RsvpInput, type RsvpResult } from './types'

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

type RpcPayload = {
  id: string
  guest_name: string
  diaper_size: DiaperSize
  quota_fallback: boolean
  fallback_message: string | null
}

function isDiaperSize(value: unknown): value is DiaperSize {
  return typeof value === 'string' && DIAPER_SIZES.includes(value as DiaperSize)
}

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  if (!isSupabaseConfigured || !supabase) {
    throw new RsvpError(
      'O formulário ainda não está ligado ao Supabase. Configure a URL e a chave anônima.',
      'config',
    )
  }

  const { data, error } = await supabase.rpc('assign_and_insert_rsvp', {
    p_guest_name: input.guestName,
    p_phone: input.phone,
    p_email: input.email || null,
    p_adults_count: input.adultsCount,
    p_notes: input.notes || null,
  })

  if (error) {
    const message = error.message ?? ''
    if (message.includes('duplicate_rsvp')) {
      throw new RsvpError(
        'Já recebemos uma confirmação com este nome e telefone. Se precisar de alterar alguma coisa, fale com Carlos Eduardo ou Wilayane.',
        'duplicate',
      )
    }
    if (message.startsWith('invalid_')) {
      throw new RsvpError('Confira os campos e tente novamente.', 'validation')
    }
    throw new RsvpError(
      'Não conseguimos enviar agora. Verifique a conexão e tente de novo.',
      'network',
    )
  }

  const payload = data as RpcPayload | null
  if (!payload || !isDiaperSize(payload.diaper_size)) {
    throw new RsvpError(
      'A confirmação foi enviada, mas a resposta veio incompleta. Fale com os pais para confirmar o tamanho.',
      'network',
    )
  }

  return {
    id: payload.id,
    guestName: payload.guest_name,
    diaperSize: payload.diaper_size,
    quotaFallback: Boolean(payload.quota_fallback),
    fallbackMessage: payload.fallback_message,
  }
}
