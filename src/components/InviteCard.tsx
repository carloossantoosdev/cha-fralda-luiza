import type { ReactNode } from 'react'

export type InvitePanel = 'rsvp' | 'place' | 'gifts'

const actions: Array<{ id: InvitePanel; image: string; label: ReactNode }> = [
  {
    id: 'rsvp',
    image: '/botao-presenca.jpg',
    label: (
      <>
        Confirmar
        <br />
        presença
      </>
    ),
  },
  {
    id: 'place',
    image: '/botao-local.jpg',
    label: (
      <>
        Localização
        <br />
        do chá
      </>
    ),
  },
  {
    id: 'gifts',
    image: '/botao-presente.jpg',
    label: (
      <>
        Sugestões
        <br />
        de presentes
      </>
    ),
  },
]

type InviteCardProps = {
  onSelect: (panel: InvitePanel) => void
  musicOn: boolean
  onToggleMusic: () => void
}

export function InviteCard({ onSelect, musicOn, onToggleMusic }: InviteCardProps) {
  return (
    <div className="card-in relative">
      <img
        src="/convite-luiza.jpg?v=8"
        alt="Convite do chá de fraldas da Luiza. Chá de fraldas, 5 de dezembro de 2026, às 16h, no Salão de Festas do Residencial Jardim das Flores, Recife."
        className="block w-full"
      />
      <button
        type="button"
        onClick={onToggleMusic}
        aria-pressed={musicOn}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-base text-[#e9899c] shadow-sm"
      >
        <span aria-hidden>{musicOn ? '♫' : '♪'}</span>
        <span className="sr-only">{musicOn ? 'Pausar música' : 'Ouvir música'}</span>
      </button>
      <div className="absolute left-[8%] right-[8%] top-[71%] grid h-[12.8%] grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action.id)}
            className="flex h-full flex-col items-center justify-center bg-transparent"
          >
            <span className="block h-12 w-12 overflow-hidden rounded-full">
              <img src={action.image} alt="" className="h-full w-full scale-[1.55] object-cover" />
            </span>
            <span className="mt-1 max-w-[5.4rem] font-display text-[12px] leading-[1.05] text-[#a38b71]">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
