import { useState } from 'react'
import { EventDetails } from './components/EventDetails'
import { Hero } from './components/Hero'
import { MapSection } from './components/MapSection'
import { RsvpForm } from './components/RsvpForm'
import { ThankYouCard } from './components/ThankYouCard'
import { eventDetails } from './lib/event'
import type { RsvpResult } from './lib/types'

export default function App() {
  const [confirmation, setConfirmation] = useState<RsvpResult | null>(null)

  return (
    <div className="min-h-svh">
      <Hero />
      <EventDetails />
      <MapSection />
      {confirmation ? (
        <ThankYouCard result={confirmation} />
      ) : (
        <RsvpForm onConfirmed={setConfirmation} />
      )}
      <footer className="px-5 pb-12 text-center text-sm text-ink/60">
        <p className="font-display text-2xl text-ink">{eventDetails.babyName}</p>
        <p className="mt-2">
          Com carinho, {eventDetails.hosts}
          <span className="mx-2 text-blush">·</span>
          {eventDetails.dateShort}
        </p>
      </footer>
    </div>
  )
}
