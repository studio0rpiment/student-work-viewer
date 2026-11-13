import { useEffect } from 'react'
import HomeLink from '../components/HomeLink'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { APP_NAME, courseForTerm } from '../site'
import type { Doc, DocSection } from '../content/docs'
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
              <a href={`#${s.id}`}>{s.tocLabel ?? s.heading}</a>
              {s.outline && (
                <ul className="doc-toc__outline">
                  {s.outline.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
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

        {groupSections(doc.sections).map((group) =>
          group.length > 1 ? (
            <div key={group[0].id} className="doc__columns">
              {group.map(renderSection)}
            </div>
          ) : (
            renderSection(group[0])
          ),
        )}
      </main>
    </div>
  )
}

function renderSection(s: DocSection) {
  return (
    <section key={s.id} id={s.id} className="doc__section">
      <h2>
        {s.headingHref ? (
          <a href={s.headingHref} target="_blank" rel="noreferrer">
            {s.heading}
          </a>
        ) : (
          s.heading
        )}
      </h2>
      <div className="doc__prose">{s.body}</div>
    </section>
  )
}

/** Runs of consecutive `paired` sections become one group; every other section is a group of one. */
function groupSections(sections: DocSection[]): DocSection[][] {
  const groups: DocSection[][] = []
  for (const s of sections) {
    const last = groups[groups.length - 1]
    if (s.paired && last?.[0].paired) last.push(s)
    else groups.push([s])
  }
  return groups
}
