import type { ReactNode } from 'react'

type FrameScreenProps = {
  children: ReactNode
  onBack: () => void
}

export function FrameScreen({ children, onBack }: FrameScreenProps) {
  return (
    <div className="relative bg-[#fff7f4]">
      <img src="/moldura-floral.jpg?v=2" alt="" className="block w-full" />
      <div className="absolute inset-x-[18%] top-[14%] bottom-[18%] flex flex-col items-center text-center">
        <div className="frame-scroll flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto">{children}</div>
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar ao convite"
          className="mt-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e9899c] bg-white/90 text-[#e9899c]"
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
