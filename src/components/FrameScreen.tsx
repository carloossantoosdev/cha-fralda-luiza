import type { ReactNode } from 'react'
import { MusicButton } from './MusicButton'

type FrameScreenProps = {
  children: ReactNode
  onBack: () => void
  musicOn: boolean
  onToggleMusic: () => void
}

export function FrameScreen({ children, onBack, musicOn, onToggleMusic }: FrameScreenProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#f7d4e0]">
      <div className="relative w-full">
        <img src="/moldura-floral.jpg?v=2" alt="" className="block w-full" />
        <MusicButton musicOn={musicOn} onToggleMusic={onToggleMusic} />
        <div className="absolute inset-x-[18%] top-[13%] bottom-[11%] flex flex-col items-center text-center">
          <div className="frame-scroll flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto">{children}</div>
        </div>
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar ao convite"
          className="absolute bottom-[3%] left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-[#e9899c] bg-white/90 text-[#e9899c]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
