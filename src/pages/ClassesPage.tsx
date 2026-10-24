import { useEffect } from 'react'
import Label from '../components/Label'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { APP_NAME, COURSES, coursePath } from '../site'
import type { ThemeMode } from '../themes'

interface Props {
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

/** Front page: every course, newest first, each with its code and term. */
export default function ClassesPage({ navigate, themeMode, onToggleTheme }: Props) {
  useEffect(() => {
    document.title = APP_NAME
  }, [])

  return (
    <>
      <Toolbar>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </Toolbar>
      <main className="home">
        <header className="home__title">
          <Label className="label--muted">classes</Label>
          <h1 className="home__h1">{APP_NAME}</h1>
        </header>
        <ul className="home__list">
          {COURSES.map((c) => (
            <li key={c.slug}>
              <a
                className="home__item"
                href={coursePath(c)}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(coursePath(c))
                }}
              >
                <span className="home__item-title">{c.title}</span>
                <Label className="label--muted label--keep">
                  {c.code} · {c.term}
                </Label>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
