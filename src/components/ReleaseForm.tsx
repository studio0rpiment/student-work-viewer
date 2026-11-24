import { useState, type FormEvent } from 'react'
import ChoiceGroup from './ChoiceGroup'
import Field from './Field'
import Label from './Label'
import { CHOICES, ERRORS, PLACES, Q, type ReleaseChoice, type ReleasePlace } from '../releaseCopy'
import type { ReleaseInput } from '../types'

interface Props {
  course: string
  term: string
  /** Sends the release; rejects if it didn't go through. */
  onSubmit: (input: ReleaseInput) => Promise<void>
}

type FieldName = 'name' | 'email' | 'agreedName'

const isGwuEmail = (s: string) => /^[^\s@]+@(gwmail\.)?gwu\.edu$/i.test(s.trim())

/** Today as the student sees it, e.g. 24 November 2026. */
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/**
 * The release form. Validates on change and blur; an error shows only once the
 * student has left that field. Submit stays disabled until every required
 * answer is in; Enter in the last field also submits.
 */
export default function ReleaseForm({ course, term, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [choice, setChoice] = useState<ReleaseChoice | null>(null)
  const [places, setPlaces] = useState<ReleasePlace[]>([])
  const [agreedName, setAgreedName] = useState('')
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({ name: false, email: false, agreedName: false })
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)

  const problems: Record<FieldName, string | undefined> = {
    name: name.trim() ? undefined : ERRORS.name,
    email: isGwuEmail(email) ? undefined : ERRORS.email,
    agreedName: agreedName.trim() ? undefined : ERRORS.agreedName,
  }
  const ready = !problems.name && !problems.email && !problems.agreedName && choice !== null
  const shown = (f: FieldName) => (touched[f] ? problems[f] : undefined)
  const touch = (f: FieldName) => () => setTouched((t) => ({ ...t, [f]: true }))

  const send = async () => {
    if (!ready || sending || choice === null) return
    setSending(true)
    setFailed(null)
    const yes = choice !== 'none'
    try {
      await onSubmit({
        course,
        term,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        choice,
        show_on_viewer: yes && places.includes('viewer'),
        show_in_program: yes && places.includes('program'),
        agreed_name: agreedName.trim(),
      })
    } catch (e) {
      // 42501: the database's row rule refused it, i.e. the email isn't on the roster.
      setFailed((e as { code?: string })?.code === '42501' ? ERRORS.notOnList : ERRORS.failed)
      setSending(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    send()
  }

  const placeOptions: { value: ReleasePlace; label: string }[] = (Object.keys(PLACES) as ReleasePlace[]).map((value) => ({ value, label: PLACES[value] }))

  return (
    <form className="release__form" onSubmit={submit} noValidate>
      <section className="release__q">
        <h2 className="release__h2">
          <span className="release__n">1</span>
          {Q.identity}
        </h2>
        <Field
          label={Q.name}
          value={name}
          onCommit={setName}
          onInput={setName}
          onBlur={touch('name')}
          autoComplete="name"
          error={shown('name')}
        />
        <Field
          label={Q.email}
          type="email"
          value={email}
          onCommit={setEmail}
          onInput={setEmail}
          onBlur={touch('email')}
          autoComplete="email"
          placeholder="you@gwu.edu"
          error={shown('email')}
        />
      </section>

      <section className="release__q">
        <ChoiceGroup<ReleaseChoice>
          name="choice"
          legend={<><span className="release__n">2</span>{Q.choice}</>}
          hint={Q.choiceHint}
          options={CHOICES}
          value={choice}
          onChange={setChoice}
        />
      </section>

      {choice !== 'none' && (
        <section className="release__q">
          <ChoiceGroup<ReleasePlace>
            multiple
            name="where"
            legend={<><span className="release__n">3</span>{Q.where}</>}
            hint={Q.whereHint}
            options={placeOptions}
            value={places}
            onChange={setPlaces}
          />
        </section>
      )}

      <section className="release__q">
        <h2 className="release__h2">
          <span className="release__n">4</span>
          {Q.others}
        </h2>
        <p>{Q.othersBody}</p>
      </section>

      <section className="release__q">
        <h2 className="release__h2">
          <span className="release__n">5</span>
          {Q.change}
        </h2>
        <p>{Q.changeBody}</p>
      </section>

      <section className="release__q">
        <h2 className="release__h2">
          <span className="release__n">6</span>
          {Q.agreement}
        </h2>
        <p>{Q.agreementBody}</p>
        <div className="release__sign">
          <Field
            label={Q.agreedName}
            value={agreedName}
            onCommit={setAgreedName}
            onInput={setAgreedName}
            onBlur={touch('agreedName')}
            onEnter={() => {
              setTouched({ name: true, email: true, agreedName: true })
              send()
            }}
            error={shown('agreedName')}
          />
          <div className="field">
            <span className="label label--muted">{Q.date}</span>
            <span className="release__date">{today()}</span>
          </div>
        </div>
      </section>

      <div className="release__submit">
        <button type="submit" className="text-button release__button" disabled={!ready || sending}>
          {sending ? Q.sending : Q.submit}
        </button>
        {failed && <Label className="field__error">{failed}</Label>}
      </div>
    </form>
  )
}
