import { useState, type FormEvent } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { RsvpError, submitRsvp } from '../lib/rsvp'
import type { RsvpResult } from '../lib/types'

type FieldErrors = {
  guestName?: string
  phone?: string
  email?: string
  adultsCount?: string
  notes?: string
}

type RsvpFormProps = {
  onConfirmed: (result: RsvpResult) => void
}

const inputClass =
  'mt-2 w-full rounded-2xl border border-blush bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/30 focus:border-rose focus:ring-2 focus:ring-blush'

function validate(fields: {
  guestName: string
  phone: string
  email: string
  adultsCount: number
  notes: string
}): FieldErrors {
  const errors: FieldErrors = {}
  const name = fields.guestName.trim()
  const digits = fields.phone.replace(/\D/g, '')
  const email = fields.email.trim()

  if (name.length < 3) errors.guestName = 'Escreva o nome completo.'
  else if (name.length > 120) errors.guestName = 'Use um nome com até 120 caracteres.'

  if (digits.length < 10 || digits.length > 13) {
    errors.phone = 'Informe um telefone com DDD, de 10 a 13 dígitos.'
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Este e-mail não parece válido.'
  }

  if (!Number.isInteger(fields.adultsCount) || fields.adultsCount < 1 || fields.adultsCount > 6) {
    errors.adultsCount = 'Escolha entre 1 e 6 pessoas.'
  }

  if (fields.notes.trim().length > 500) {
    errors.notes = 'A observação pode ter até 500 caracteres.'
  }

  return errors
}

export function RsvpForm({ onConfirmed }: RsvpFormProps) {
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [adultsCount, setAdultsCount] = useState(1)
  const [notes, setNotes] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const errors = validate({ guestName, phone, email, adultsCount, notes })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      const result = await submitRsvp({
        guestName: guestName.trim(),
        phone,
        email: email.trim(),
        adultsCount,
        notes: notes.trim(),
      })
      onConfirmed(result)
    } catch (error) {
      if (error instanceof RsvpError) setFormError(error.message)
      else setFormError('Não conseguimos enviar agora. Tente de novo em instantes.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="rsvp" className="px-5 py-12 sm:px-8" aria-labelledby="rsvp-titulo">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-6 shadow-card sm:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-rose">RSVP</p>
        <h2 id="rsvp-titulo" className="mt-3 font-display text-4xl sm:text-5xl">
          Confirme a sua presença
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Um pacote de fraldas por família, mesmo que venham mais pessoas. A lista de
          convidados fica só com os pais.
        </p>

        {!isSupabaseConfigured && (
          <p className="mt-5 rounded-2xl bg-butter px-4 py-3 text-sm leading-relaxed" role="status">
            O envio ainda depende do projeto Supabase. Com a URL e a chave anônima no
            ambiente, este formulário passa a guardar as confirmações.
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="guest-name" className="text-sm font-medium">
              Nome completo
            </label>
            <input
              id="guest-name"
              name="guestName"
              autoComplete="name"
              required
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.guestName)}
              aria-describedby={fieldErrors.guestName ? 'guest-name-error' : undefined}
            />
            {fieldErrors.guestName && (
              <p id="guest-name-error" className="mt-2 text-sm text-rose">
                {fieldErrors.guestName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              Telefone (WhatsApp)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            />
            {fieldErrors.phone && (
              <p id="phone-error" className="mt-2 text-sm text-rose">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              E-mail <span className="font-normal text-ink/50">(opcional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-2 text-sm text-rose">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="adults" className="text-sm font-medium">
              Quantas pessoas vêm?
            </label>
            <select
              id="adults"
              name="adultsCount"
              value={adultsCount}
              onChange={(event) => setAdultsCount(Number(event.target.value))}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? 'pessoa' : 'pessoas'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="text-sm font-medium">
              Observações <span className="font-normal text-ink/50">(opcional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Crianças, restrições ou um recado carinhoso"
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.notes)}
              aria-describedby={fieldErrors.notes ? 'notes-error' : undefined}
            />
            {fieldErrors.notes && (
              <p id="notes-error" className="mt-2 text-sm text-rose">
                {fieldErrors.notes}
              </p>
            )}
          </div>

          {formError && (
            <p className="rounded-2xl bg-blush/60 px-4 py-3 text-sm leading-relaxed" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-cream transition hover:bg-rose disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? 'Enviando…' : 'Confirmar presença'}
          </button>
        </form>
      </div>
    </section>
  )
}
