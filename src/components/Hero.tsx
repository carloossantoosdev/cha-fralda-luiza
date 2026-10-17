import { eventDetails } from '../lib/event'

export function Hero() {
  return (
    <header className="relative overflow-hidden px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-blush/80 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-24 h-48 w-48 rounded-full bg-butter/90 blur-2xl"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="rise text-xs font-medium uppercase tracking-[0.28em] text-rose">
          {eventDetails.hosts}
        </p>
        <p className="rise rise-delay-1 mt-8 font-display text-2xl italic text-rose sm:text-3xl">
          convidam para celebrar
        </p>
        <h1 className="rise rise-delay-2 mt-3 font-display text-5xl leading-none text-ink sm:text-7xl">
          Chá de fraldas
          <span className="mt-2 block text-rose">da Luiza</span>
        </h1>
        <p className="rise rise-delay-3 mt-8 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Uma tarde para receber {eventDetails.babyName} com afeto, riso e o que ela
          vai usar nos primeiros meses: a sua presença e um pacote de fraldas.
        </p>

        <dl className="rise rise-delay-3 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-10">
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-rose">Data</dt>
            <dd className="mt-1 font-display text-2xl">{eventDetails.dateLabel}</dd>
          </div>
          <div className="hidden h-10 w-px bg-blush sm:block" />
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-rose">Horário</dt>
            <dd className="mt-1 font-display text-2xl">{eventDetails.timeLabel}</dd>
          </div>
        </dl>

        <a
          href="#rsvp"
          className="mt-10 inline-flex items-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-cream transition hover:bg-rose"
        >
          Confirmar presença
        </a>
      </div>
    </header>
  )
}
