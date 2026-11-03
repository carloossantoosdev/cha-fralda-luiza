const VIDEO_ID = '_DZdm2mX5LM'

type YtPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  unMute: () => void
  setVolume: (volume: number) => void
  getPlayerState: () => number
  getIframe?: () => HTMLIFrameElement
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
let creating = false
let resumeTimer = 0
let resumes = 0

function playNow() {
  if (!player || !ready) return
  player.unMute()
  player.setVolume(45)
  player.playVideo()
}

function scheduleResume() {
  if (!shouldPlay || resumes >= 12) return
  window.clearTimeout(resumeTimer)
  resumeTimer = window.setTimeout(() => {
    if (!shouldPlay) return
    resumes += 1
    playNow()
  }, 300)
}

function ensureHost() {
  if (document.getElementById('youtube-audio')) return
  const host = document.createElement('div')
  host.id = 'youtube-audio-host'
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = [
    'position:fixed',
    'left:0',
    'bottom:0',
    'width:200px',
    'height:200px',
    'opacity:0.02',
    'overflow:hidden',
    'pointer-events:none',
    'z-index:0',
  ].join(';')
  const slot = document.createElement('div')
  slot.id = 'youtube-audio'
  host.appendChild(slot)
  document.body.appendChild(host)
}

function createPlayer() {
  const yt = window.YT
  if (!yt || player || creating) return
  ensureHost()
  if (!document.getElementById('youtube-audio')) return
  creating = true
  player = new yt.Player('youtube-audio', {
    videoId: VIDEO_ID,
    width: 200,
    height: 200,
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
      origin: window.location.origin,
    },
    events: {
      onReady: (event: { target: YtPlayer }) => {
        ready = true
        const iframe = event.target.getIframe?.()
        if (iframe) iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture')
        if (shouldPlay) playNow()
      },
      onStateChange: (event: { data: number }) => {
        if (!shouldPlay) return
        if (event.data === yt.PlayerState.ENDED) {
          playNow()
          return
        }
        if (event.data === yt.PlayerState.PLAYING) {
          window.setTimeout(() => {
            if (player?.getPlayerState() === yt.PlayerState.PLAYING) resumes = 0
          }, 2000)
          return
        }
        if (event.data === 2 || event.data === 5 || event.data === -1) scheduleResume()
      },
    },
  })
}

export function prepareTrack() {
  ensureHost()
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
  window.clearTimeout(resumeTimer)
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
