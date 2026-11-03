type MusicButtonProps = {
  musicOn: boolean
  onToggleMusic: () => void
}

export function MusicButton({ musicOn, onToggleMusic }: MusicButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggleMusic}
      aria-pressed={musicOn}
      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-base text-[#e9899c] shadow-sm"
    >
      <span aria-hidden>{musicOn ? '♫' : '♪'}</span>
      <span className="sr-only">{musicOn ? 'Pausar música' : 'Ouvir música'}</span>
    </button>
  )
}
