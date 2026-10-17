import { eventDetails } from '../lib/event'

export function MapSection() {
  const { address, mapsEmbedUrl, mapsLink } = eventDetails

  return (
    <section className="px-5 py-10 sm:px-8" aria-labelledby="local-titulo">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-card">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-blush/40 p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-rose">Local</p>
            <h2 id="local-titulo" className="mt-3 font-display text-4xl">
              Onde nos encontramos
            </h2>
            {address ? (
              <>
                <p className="mt-4 text-base leading-relaxed text-ink/80">{address}</p>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex text-sm font-medium text-rose underline decoration-blush underline-offset-4"
                >
                  Abrir no Google Maps
                </a>
              </>
            ) : (
              <p className="mt-4 text-base leading-relaxed text-ink/80">
                O endereço completo ainda será confirmado. Assim que estiver definido,
                o mapa e o link aparecem neste cartão.
              </p>
            )}
          </div>

          {mapsEmbedUrl ? (
            <iframe
              title="Mapa do chá de fraldas da Luiza"
              src={mapsEmbedUrl}
              className="min-h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex min-h-72 items-center justify-center bg-butter/50 p-8 text-center">
              <p className="max-w-xs font-display text-2xl text-ink/70">
                Mapa a caminho, junto com o endereço.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
