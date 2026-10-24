import { useEffect, useState } from 'react'
import Label from '../components/Label'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { listShowcases } from '../lib/data'
import { APP_NAME, coursePath, type Course } from '../site'
import { formatDue, type Showcase } from '../types'
import type { ThemeMode } from '../themes'

interface Props {
  course: Course
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

/**
 * A course page: code, term and title, then the course's showcases in due-date
 * order (earliest first) — the semester's progression — then its other links.
 */
export default function HomePage({ course, navigate, themeMode, onToggleTheme }: Props) {
  const [showcases, setShowcases] = useState<Showcase[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = `${course.title} ${course.term} — ${APP_NAME}`
    listShowcases()
      .then((all) => setShowcases(all.filter((s) => s.term.toLowerCase() === course.term.toLowerCase())))
      .catch((e: Error) => setError(e.message))
  }, [course])

  const base = coursePath(course)

  return (
    <>
      <Toolbar>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </Toolbar>
      <main className="home">
        <header className="home__title">
          <Label className="label--muted label--keep">
            {course.code} · {course.term}
          </Label>
          <h1 className="home__h1">
            {course.title} {course.term}
          </h1>
        </header>
        <ul className="home__list">
          {error && <Label className="label--muted">{error}</Label>}
          {showcases?.map((s) => (
            <li key={s.id}>
              <a
                className="home__item"
                href={`${base}/${s.slug}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`${base}/${s.slug}`)
                }}
              >
                <span className="home__item-title">{s.title}</span>
                <Label className="label--muted label--keep">{formatDue(s)}</Label>
              </a>
            </li>
          ))}
          {/* These live in other apps (the forms), so they are full page loads. */}
          {showcases &&
            course.links.map((l) => (
              <li key={l.href}>
                <a className="home__item" href={l.href}>
                  <span className="home__item-title">{l.label}</span>
                  {l.note && <Label className="label--muted label--keep">{l.note}</Label>}
                </a>
              </li>
            ))}
        </ul>
        <a
          className="label label--link"
          href="/classes"
          onClick={(e) => {
            e.preventDefault()
            navigate('/classes')
          }}
        >
          all classes
        </a>
      </main>
    </>
  )
}
