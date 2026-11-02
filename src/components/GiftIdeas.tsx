import { eventDetails, hostWhatsappLink } from '../lib/event'
import { DIAPER_SIZE_LABELS, type RsvpResult } from '../lib/types'

type GiftIdeasProps = {
  result: RsvpResult | null
}

export function GiftIdeas({ result }: GiftIdeasProps) {
  const sizeLabel = result ? DIAPER_SIZE_LABELS[result.diaperSize] : null
  const whatsapp = hostWhatsappLink(
    'Olá! Não vou conseguir ir ao chá da Luiza, mas quero ajudar com fraldas ou outro presente.',
  )
  const help = (className: string) => (
    <p className={className}>
      Não vai conseguir ir ao chá, mas quer ajudar com fraldas ou outro presente? Fale com{' '}
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[#e58b9a] underline decoration-[#f3c3ce] underline-offset-4"
        >
          {eventDetails.hosts}
        </a>
      ) : (
        eventDetails.hosts
      )}
      .
    </p>
  )

  return (
    <section
      aria-labelledby="presentes-titulo"
      className="flex h-full min-h-full w-full flex-1 flex-col items-center text-center"
    >
      <p className="font-display text-4xl leading-none text-[#b76b78]">Sugestões</p>
      <h2 id="presentes-titulo" className="-mt-1 font-script text-5xl leading-none text-[#e58b9a]">
        Presentes:
      </h2>

      {sizeLabel ? (
        <div className="mb-8 flex w-full flex-col items-center gap-10">
          <div className="w-full rounded-[1.6rem] px-5 py-5 text-center">
            <p className="text-sm uppercase tracking-[0.18em] text-[#e58b9a]">O seu pacote</p>
            <p className="mt-2 font-display text-3xl leading-tight text-[#b76b78]">
              Traga fraldas tamanho {sizeLabel}
            </p>
            {result?.quotaFallback && (
              <p className="mt-3 text-sm leading-relaxed text-[#b76b78]">
                {result.fallbackMessage ??
                  'Qualquer tamanho P ou M também ajuda, se o indicado estiver difícil de encontrar.'}
              </p>
            )}
          </div>
          {help('mt-12 text-sm leading-relaxed text-[#b76b78]')}
        </div>
      ) : (
        <>
          <div className="min-h-36 flex-1" aria-hidden />
          <div className="mb-4 flex w-full flex-col items-center gap-4">
            <p className="text-sm leading-relaxed text-[#b76b78]">
              Confirme a presença para ver o tamanho da fralda da sua família. Cada família confirma uma vez só.
            </p>
            {help('text-sm leading-relaxed text-[#b76b78]')}
          </div>
        </>
      )}
    </section>
  )
}
