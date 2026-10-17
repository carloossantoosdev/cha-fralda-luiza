import { eventDetails } from '../lib/event'

const notes = [
  {
    title: 'O chá',
    body: 'Cada família confirma a presença e leva um pacote de fraldas. O tamanho aparece logo depois do envio, para a Luiza ter de tudo ao longo dos primeiros meses. A marca é livre.',
  },
  {
    title: 'Como vestir',
    body: 'Não há traje obrigatório. Se quiserem entrar no tom da festa, rosa pálido e amarelo manteiga ficam lindos — e o conforto também.',
  },
  {
    title: 'Quando',
    body: `${eventDetails.dateLabel}. ${eventDetails.timeLabel}.`,
  },
]

export function EventDetails() {
  return (
    <section className="px-5 py-6 sm:px-8" aria-labelledby="detalhes-titulo">
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
        {notes.map((note) => (
          <article
            key={note.title}
            className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-card"
          >
            <h2 className="font-display text-3xl text-ink">{note.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{note.body}</p>
          </article>
        ))}
      </div>
      <h2 id="detalhes-titulo" className="sr-only">
        Detalhes do chá de fraldas
      </h2>
    </section>
  )
}
