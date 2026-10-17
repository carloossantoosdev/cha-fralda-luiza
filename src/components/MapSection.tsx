import { eventDetails } from '../lib/event'

export function MapSection() {
  const { address, mapsEmbedUrl, mapsLink } = eventDetails

  return (
    <section className="flex w-full flex-col items-center text-center" aria-labelledby="local-titulo">
      <p className="font-display text-4xl leading-none text-[#b76b78]">Localização</p>
      <h2 id="local-titulo" className="-mt-1 font-script text-5xl leading-none text-[#e58b9a]">
        do chá
      </h2>
      <div className="mt-4 w-full overflow-hidden rounded-2xl">
        {address ? (
          <p className="text-sm leading-relaxed text-[#b76b78]">{address}</p>
        ) : (
          <p className="text-sm leading-relaxed text-[#b76b78]">
            O endereço completo ainda será confirmado.
          </p>
        )}
        {mapsEmbedUrl ? (
          <iframe
            title="Mapa do chá de fraldas da Luiza"
            src={mapsEmbedUrl}
            className="mt-3 h-40 w-full rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : null}
        {mapsLink ? (
          <div className="mt-3 flex flex-col items-center gap-2">
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm text-[#e58b9a] underline decoration-[#f3c3ce] underline-offset-4"
            >
              Abrir no Google Maps
            </a>
            <a
              href={eventDetails.wazeLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm text-[#e58b9a] underline decoration-[#f3c3ce] underline-offset-4"
            >
              Abrir no Waze
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
