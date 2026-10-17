export const DIAPER_SIZES = ['P', 'M', 'G'] as const

export type DiaperSize = (typeof DIAPER_SIZES)[number]

export const DIAPER_SIZE_LABELS: Record<DiaperSize, string> = {
  P: 'P',
  M: 'M',
  G: 'G',
}

export type RsvpInput = {
  guestName: string
  phone: string
  adultsCount: number
  notes: string
}

export type RsvpResult = {
  id: string
  guestName: string
  diaperSize: DiaperSize
  quotaFallback: boolean
  fallbackMessage: string | null
  alreadyConfirmed: boolean
}
