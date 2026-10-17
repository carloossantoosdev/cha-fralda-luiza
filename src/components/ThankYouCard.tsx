import { eventDetails, hostWhatsappLink } from '../lib/event'
import { DIAPER_SIZE_LABELS, type RsvpResult } from '../lib/types'

type ThankYouCardProps = {
  result: RsvpResult
}

export function ThankYouCard({ result }: ThankYouCardProps) {
  const firstName = result.guestName.trim().split(/\s+/)[0]
  const sizeLabel = DIAPER_SIZE_LABELS[result.diaperSize]
  const whatsapp = hostWhatsappLink(
    `Olá! Confirmei presença no chá da Luiza e fiquei com o tamanho ${result.diaperSize}.`,
  )

  return (
    <section id="rsvp" className="px-5 py-12 sm:px-8" aria-labelledby="obrigado-titulo">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-6 text-center shadow-card sm:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-rose">Presença confirmada</p>
        <h2 id="obrigado-titulo" className="mt-3 font-display text-4xl sm:text-5xl">
          Que alegria, {firstName}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink/75">
          A Luiza e os pais agradecem. O seu lugar no chá de 5 de dezembro já está
          guardado.
        </p>

        <div className="mt-8 rounded-[1.6rem] bg-butter/80 px-6 py-7">
          <p className="text-sm uppercase tracking-[0.18em] text-rose">O seu pacote</p>
          <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Por favor, traga fraldas tamanho {sizeLabel}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink/75">
            Distribuímos os tamanhos para a Luiza ter de tudo ao longo dos primeiros
            meses. Um pacote por família chega — a marca é livre.
          </p>
          {result.quotaFallback && (
            <p className="mt-4 text-sm leading-relaxed text-ink">
              {result.fallbackMessage ??
                'Qualquer tamanho P ou M também ajuda, se o indicado estiver difícil de encontrar.'}
            </p>
          )}
        </div>

        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex text-sm font-medium text-rose underline decoration-blush underline-offset-4"
          >
            Falar com {eventDetails.hosts} no WhatsApp
          </a>
        )}
      </div>
    </section>
  )
}
