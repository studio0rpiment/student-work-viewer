import { useEffect, useState } from 'react'
import Label from '../components/Label'
import ReleaseForm from '../components/ReleaseForm'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { submitRelease } from '../lib/data'
import { supabase } from '../lib/supabase'
import { DONE, INTRO, PLACES, TITLE, choiceLabel } from '../releaseCopy'
import { COURSES, findCourse } from '../site'
import type { ThemeMode } from '../themes'
import type { ReleaseInput } from '../types'

interface Props {
  themeMode: ThemeMode
  onToggleTheme: () => void
}

/**
 * /release — students' written permission to show their work. Unlinked: Kevin
 * sends the URL. ?course=<course slug> and ?term=<term> preselect what the
 * release is for; without them, the current course and F26.
 */
export default function ReleasePage({ themeMode, onToggleTheme }: Props) {
  const params = new URLSearchParams(location.search)
  const course = findCourse(params.get('course') ?? '') ?? COURSES[0]
  const term = (params.get('term') ?? 'F26').trim().toUpperCase()
  const [sent, setSent] = useState<ReleaseInput | null>(null)

  useEffect(() => {
    document.title = 'Permission to show your work'
  }, [])

  const submit = async (input: ReleaseInput) => {
    await submitRelease(input)
    setSent(input)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Toolbar>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </Toolbar>
      <main className="release">
        <h1 className="release__title">{TITLE}</h1>
        {!supabase ? (
          <Label className="label--muted">no database configured</Label>
        ) : sent ? (
          <Confirmation sent={sent} />
        ) : (
          <>
            <p className="release__intro">{INTRO}</p>
            <ReleaseForm course={course.code} term={term} onSubmit={submit} />
          </>
        )}
      </main>
    </>
  )
}

/** Repeats the student's answer back and says how to change it. */
function Confirmation({ sent }: { sent: ReleaseInput }) {
  const places = [sent.show_on_viewer && PLACES.viewer, sent.show_in_program && PLACES.program].filter(Boolean)
  return (
    <section className="release__done" aria-live="polite">
      <p className="release__h2">{DONE.heading}</p>
      <dl className="release__answer">
        <dt className="label label--muted">{DONE.youChose}</dt>
        <dd>{choiceLabel(sent.choice)}</dd>
        {sent.choice !== 'none' && (
          <>
            <dt className="label label--muted">{DONE.where}</dt>
            <dd>{places.length ? places.join('; ') : DONE.nowhere}</dd>
          </>
        )}
      </dl>
      <p>{DONE.change()}</p>
    </section>
  )
}
