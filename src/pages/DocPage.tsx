import { useEffect } from 'react'
import HomeLink from '../components/HomeLink'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { APP_NAME, courseForTerm } from '../site'
import type { Doc } from '../content/docs'
import type { ThemeMode } from '../themes'

interface Props {
  doc: Doc
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

/** A course document, laid out like the midterm: contents bar with the due date on the left, text on the right. */
export default function DocPage({ doc, navigate, themeMode, onToggleTheme }: Props) {
  useEffect(() => {
    document.title = `${doc.title} — ${APP_NAME}`
  }, [doc])

  return (
    <div className="doc-layout">
      <HomeLink course={courseForTerm(doc.term)} navigate={navigate} />
      <Toolbar>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </Toolbar>

      <nav className="doc-toc" aria-label="Contents">
        <p className="doc-toc__due">
          <span>Due</span>
          <span>{doc.due}</span>
        </p>
        <ol>
          {doc.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.heading}</a>
            </li>
          ))}
        </ol>
        {doc.schedule && (
          <dl className="doc-toc__schedule">
            {doc.schedule.map((d) => (
              <div key={d.date}>
                <dt>{d.date}</dt>
                <dd>{d.text}</dd>
              </div>
            ))}
          </dl>
        )}
      </nav>

      <main className="doc">
        <header className="doc__head">
          <h1>
            {doc.title} <span className="doc__accent">{doc.term}</span>
          </h1>
          <p className="doc__subtitle">{doc.subtitle}</p>
          <p className="doc__subtitle">Due {doc.due}</p>
        </header>

        {doc.intro && <div className="doc__intro doc__prose">{doc.intro}</div>}

        {doc.sections.map((s) => (
          <section key={s.id} id={s.id} className="doc__section">
            <h2>{s.heading}</h2>
            <div className="doc__prose">{s.body}</div>
          </section>
        ))}
      </main>
    </div>
  )
}
