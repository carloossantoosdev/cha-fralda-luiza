const address =
  import.meta.env.VITE_EVENT_ADDRESS?.trim() ||
  'R. Dr. João Santos Filho, 250 - Casa Forte, Recife - PE, 52060-615'
const mapsQuery = import.meta.env.VITE_MAPS_EMBED_QUERY?.trim() ?? ''
const mapsKey = import.meta.env.VITE_MAPS_EMBED_KEY?.trim() ?? ''
const hostWhatsapp = (import.meta.env.VITE_HOST_WHATSAPP ?? '').replace(/\D/g, '')

const encodedQuery = mapsQuery || (address ? encodeURIComponent(address) : '')

export const eventDetails = {
  babyName: 'Luiza Santos Martins',
  hosts: 'Carlos Eduardo e Wilayane Alves',
  title: 'Chá de fraldas da Luiza',
  dateLabel: 'sábado, 5 de dezembro de 2026',
  dateShort: '05/12/2026',
  timeLabel: import.meta.env.VITE_EVENT_TIME?.trim() || '15h',
  address,
  mapsEmbedUrl: encodedQuery
    ? mapsKey
      ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(mapsKey)}&q=${encodedQuery}`
      : `https://maps.google.com/maps?q=${encodedQuery}&z=16&output=embed`
    : '',
  mapsLink: encodedQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
    : '',
  wazeLink: encodedQuery ? `https://waze.com/ul?q=${encodedQuery}&navigate=yes` : '',
  hostWhatsapp,
}

export function hostWhatsappLink(message: string) {
  if (!eventDetails.hostWhatsapp) return ''
  return `https://wa.me/${eventDetails.hostWhatsapp}?text=${encodeURIComponent(message)}`
}
