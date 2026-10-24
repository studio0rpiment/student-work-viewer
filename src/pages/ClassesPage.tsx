import { useEffect } from 'react'
import Label from '../components/Label'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { COURSES, coursePath } from '../site'
import type { ThemeMode } from '../themes'

interface Props {
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

/** Front page: just the list of classes, newest first, each with its term in the title and its code. */
export default function ClassesPage({ navigate, themeMode, onToggleTheme }: Props) {
  useEffect(() => {
    document.title = 'Classes'
  }, [])

  return (
    <>
      <Toolbar>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </Toolbar>
      <main className="home">
        <header className="home__title">
          <h1 className="label label--muted home__label-h1">classes</h1>
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
                <span className="home__item-title">
                  {c.title} {c.term}
                </span>
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
