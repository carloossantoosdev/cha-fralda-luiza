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

  return (
    <section aria-labelledby="presentes-titulo" className="flex flex-col items-center">
      <p className="font-display text-4xl leading-none text-[#b76b78]">Sugestões</p>
      <h2 id="presentes-titulo" className="-mt-1 font-script text-5xl leading-none text-[#e58b9a]">
        Presentes:
      </h2>

      {sizeLabel ? (
        <div className="mt-5 w-full rounded-[1.6rem] bg-[#f8e4ea] px-5 py-6 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-[#e58b9a]">O seu pacote</p>
          <p className="mt-2 font-display text-3xl leading-tight text-[#b76b78]">
            Traga fraldas tamanho {sizeLabel}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#b76b78]">
            Um pacote por família. A marca é livre.
          </p>
          {result?.quotaFallback && (
            <p className="mt-3 text-sm leading-relaxed text-[#b76b78]">
              {result.fallbackMessage ??
                'Qualquer tamanho P ou M também ajuda, se o indicado estiver difícil de encontrar.'}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-5 text-center text-sm leading-relaxed text-[#b76b78]">
          Confirme a presença para ver o tamanho da fralda da sua família. Cada família confirma uma vez só.
        </p>
      )}

      <p className="mt-6 text-center text-sm leading-relaxed text-[#b76b78]">
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
    </section>
  )
}
