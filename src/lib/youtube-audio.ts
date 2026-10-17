const VIDEO_ID = 'foU19dHir2I'

type YtPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  unMute: () => void
  setVolume: (volume: number) => void
  getPlayerState: () => number
}

type YtNamespace = {
  Player: new (elementId: string, options: object) => YtPlayer
  PlayerState: { PLAYING: number; ENDED: number }
}

declare global {
  interface Window {
    YT?: YtNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let player: YtPlayer | null = null
let ready = false
let shouldPlay = false

function playNow() {
  if (!player || !ready) return
  player.unMute()
  player.setVolume(45)
  player.playVideo()
}

function createPlayer() {
  const yt = window.YT
  if (!yt || player) return
  player = new yt.Player('youtube-audio', {
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      playlist: VIDEO_ID,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
    events: {
      onReady: () => {
        ready = true
        if (shouldPlay) playNow()
      },
      onStateChange: (event: { data: number }) => {
        if (event.data === yt.PlayerState.ENDED) playNow()
      },
    },
  })
}

export function prepareTrack() {
  if (window.YT?.Player) {
    createPlayer()
    return
  }
  if (document.getElementById('youtube-iframe-api')) return
  window.onYouTubeIframeAPIReady = createPlayer
  const script = document.createElement('script')
  script.id = 'youtube-iframe-api'
  script.src = 'https://www.youtube.com/iframe_api'
  document.body.appendChild(script)
}

export function playTrack() {
  shouldPlay = true
  prepareTrack()
  playNow()
}

export function pauseTrack() {
  shouldPlay = false
  player?.pauseVideo()
}

export function trackIsPlaying() {
  return Boolean(player && ready && player.getPlayerState() === 1)
}

export function toggleTrack() {
  if (trackIsPlaying() || shouldPlay) {
    pauseTrack()
    return false
  }
  playTrack()
  return true
}
