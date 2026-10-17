type EnvelopeProps = {
  onOpen: () => void
  opening: boolean
}

export function Envelope({ onOpen, opening }: EnvelopeProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Toque para ver o convite"
      className={`relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#f7d4e0] transition duration-700 ${
        opening ? 'scale-105 opacity-0' : ''
      }`}
    >
      <img src="/envelope-luiza.jpg?v=7" alt="" className="block w-full" />
    </button>
  )
}
