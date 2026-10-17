import { DIAPER_SIZES, type DiaperSize, type RsvpResult } from './types'

const STORAGE_KEY = 'cha-fralda-luiza.rsvp'

function isDiaperSize(value: unknown): value is DiaperSize {
  return typeof value === 'string' && DIAPER_SIZES.includes(value as DiaperSize)
}

export function readSavedRsvp(): RsvpResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<RsvpResult>
    if (!data.id || !data.guestName || !isDiaperSize(data.diaperSize)) return null
    return {
      id: data.id,
      guestName: data.guestName,
      diaperSize: data.diaperSize,
      quotaFallback: Boolean(data.quotaFallback),
      fallbackMessage: data.fallbackMessage ?? null,
      alreadyConfirmed: Boolean(data.alreadyConfirmed),
    }
  } catch {
    return null
  }
}

export function saveRsvp(result: RsvpResult) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
}
