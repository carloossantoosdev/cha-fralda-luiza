import { useEffect, useState } from 'react'
import { Envelope } from './components/Envelope'
import { FrameScreen } from './components/FrameScreen'
import { GiftIdeas } from './components/GiftIdeas'
import { InviteCard, type InvitePanel } from './components/InviteCard'
import { MapSection } from './components/MapSection'
import { RsvpForm } from './components/RsvpForm'
import { ThankYouCard } from './components/ThankYouCard'
import { playTrack, prepareTrack, toggleTrack } from './lib/youtube-audio'
import { readSavedRsvp, saveRsvp } from './lib/saved-rsvp'
import type { RsvpResult } from './lib/types'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [opening, setOpening] = useState(false)
  const [screen, setScreen] = useState<InvitePanel | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  const [confirmation, setConfirmation] = useState<RsvpResult | null>(() => readSavedRsvp())

  useEffect(() => {
    prepareTrack()
  }, [])

  function openInvite() {
    if (opening || opened) return
    setOpening(true)
    playTrack()
    setMusicOn(true)
    window.setTimeout(() => setOpened(true), 650)
  }

  function onToggleMusic() {
    setMusicOn(toggleTrack())
  }

  function onConfirmed(result: RsvpResult) {
    saveRsvp(result)
    setConfirmation(result)
  }

  return (
    <div className="min-h-svh bg-[#f7d4e0]">
      <div id="youtube-audio" className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0" />
      <div className="mx-auto min-h-svh w-full max-w-[440px] overflow-hidden bg-[#f7d4e0] shadow-card">
        {!opened ? (
          <Envelope opening={opening} onOpen={openInvite} />
        ) : screen ? (
          <FrameScreen onBack={() => setScreen(null)}>
            {screen === 'rsvp' &&
              (confirmation ? <ThankYouCard result={confirmation} /> : <RsvpForm onConfirmed={onConfirmed} />)}
            {screen === 'place' && <MapSection />}
            {screen === 'gifts' && <GiftIdeas result={confirmation} />}
          </FrameScreen>
        ) : (
          <InviteCard
            onSelect={setScreen}
            musicOn={musicOn}
            onToggleMusic={onToggleMusic}
          />
        )}
      </div>
    </div>
  )
}
