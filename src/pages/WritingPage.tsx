import { useEffect, useState } from 'react'
import Disclose from '../components/Disclose'
import HomeLink from '../components/HomeLink'
import Label from '../components/Label'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { APP_NAME, courseForTerm } from '../site'
import { formatDue } from '../types'
import type { ThemeMode } from '../themes'
import type { BriefBlock, LevelsEntry, PathEntry, PromptsEntry, QuestionsEntry, Writing } from '../content/types'

interface Props {
  writing: Writing
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

/** A written assignment: its brief behind a triangle, then the class's work laid out to be compared. */
export default function WritingPage({ writing, navigate, themeMode, onToggleTheme }: Props) {
  useEffect(() => {
    document.title = `${writing.title} — ${APP_NAME}`
  }, [writing])

  return (
    <div className="writing-page">
      <HomeLink course={courseForTerm(writing.term)} navigate={navigate} />
      <Toolbar>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </Toolbar>
      <main className="writing">
        <header className="writing__head">
          <h1 className="home__h1">{writing.title}</h1>
          <Label className="label--muted label--keep">{formatDue(writing)}</Label>
          <p className="writing__summary">{writing.summary}</p>
          <Disclose label="the assignment" className="brief">
            <Brief blocks={writing.brief} />
          </Disclose>
        </header>
        {writing.layout === 'questions' && <Questions entries={writing.entries} />}
        {writing.layout === 'path' && <Paths entries={writing.entries} />}
        {writing.layout === 'prompts' && <Prompts entries={writing.entries} />}
        {writing.layout === 'levels' && <Levels entries={writing.entries} />}
      </main>
    </div>
  )
}

function Brief({ blocks }: { blocks: BriefBlock[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        'p' in b ? (
          <p key={i}>{b.p}</p>
        ) : 'h' in b ? (
          <p key={i} className="label label--muted">{b.h}</p>
        ) : 'q' in b ? (
          <blockquote key={i}>{b.q}</blockquote>
        ) : (
          <ul key={i}>
            {b.list.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        ),
      )}
    </>
  )
}

/**
 * Paragraph breaks in extracted text become separate paragraphs. Text after
 * "Pasted:" is the model's output the students pasted in, not their own words,
 * so it is labelled and muted.
 */
function Text({ children }: { children: string | null }) {
  if (!children) return <p className="label label--muted">—</p>
  const at = children.indexOf('Pasted:')
  const own = at === -1 ? children : children.slice(0, at).trim()
  const pasted = at === -1 ? '' : children.slice(at + 'Pasted:'.length).trim()
  const paras = (s: string) => s.split(/\n\s*\n|\n/).filter(Boolean)
  return (
    <>
      {paras(own).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {pasted && (
        <div className="pasted">
          <span className="label label--muted">pasted from the assistant</span>
          {paras(pasted).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </>
  )
}

/** Long texts start short and open in place. */
function Long({ text, label = 'read all', limit = 420 }: { text: string | null; label?: string; limit?: number }) {
  if (!text || text.length <= limit) return <Text>{text}</Text>
  const cut = text.slice(0, text.lastIndexOf(' ', limit)) + ' …'
  return (
    <details className="long">
      <summary>
        <Text>{cut}</Text>
        <span className="label label--link">{label}</span>
      </summary>
      <Text>{text}</Text>
    </details>
  )
}

/* ---------- Networks, Tokens, Embeddings: read by question ---------- */

function Questions({ entries }: { entries: QuestionsEntry[] }) {
  const sections: { key: string; title: string; render: (e: QuestionsEntry) => React.ReactNode }[] = [
    { key: 'networks', title: 'Networks · when I changed …', render: (e) => <Text>{e.networks}</Text> },
    { key: 'tokens', title: 'Tokens · I changed …', render: (e) => <Text>{e.tokens}</Text> },
    { key: 'embeddings', title: 'Embeddings · near and far', render: (e) => <Embedding e={e.embeddings} /> },
    { key: 'closing', title: 'What the Playground made visible', render: (e) => <Text>{e.closing}</Text> },
  ]
  return (
    <>
      {sections.map((s) => (
        <section key={s.key} className="writing__section">
          <h2 className="writing__h2">{s.title}</h2>
          <div className="cards">
            {entries.map((e) => (
              <article key={e.name} className="card-text">
                <Label className="label--student">{e.name}</Label>
                {s.render(e)}
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

/** Nearby terms sit together; distant terms are pushed to opposite edges. */
function Embedding({ e }: { e: QuestionsEntry['embeddings'] }) {
  if (!e) return <p className="label label--muted">—</p>
  return (
    <div className="embed">
      {e.word && <Label className="label--muted label--keep">searched “{e.word}”</Label>}
      <div className="embed__near">
        {e.near.map((w) => (
          <span key={w}>{w}</span>
        ))}
        <Label className="label--muted">near</Label>
      </div>
      <div className="embed__far">
        <span>{e.far[0]}</span>
        <Label className="label--muted">far</Label>
        <span>{e.far.slice(1).join(' · ')}</span>
      </div>
      {e.relationship && <p className="embed__rel">{e.relationship}</p>}
    </div>
  )
}

/* ---------- Anatomy of an AI System: one traced path each ---------- */

const KIND: Record<PathEntry['stops'][number]['kind'], string> = {
  material: 'material',
  labour: 'labour',
  computing: 'computing',
  other: '',
}

function Paths({ entries }: { entries: PathEntry[] }) {
  return (
    <section className="writing__section">
      <div className="paths">
        {entries.map((e) => (
          <article key={e.name} className="path">
            <header>
              <Label className="label--student">{e.name}</Label>
              {e.title && <p className="path__title">{e.title}</p>}
            </header>
            <ol className="path__stops">
              <li className="path__echo">
                <span className="path__dot" />
                <span className="label label--muted label--keep">Amazon Echo</span>
              </li>
              {e.stops.map((s, i) => (
                <li key={i}>
                  <span className="path__dot" />
                  {KIND[s.kind] && <span className="label label--muted">{KIND[s.kind]}</span>}
                  <p className="path__label">{s.label}</p>
                  <Long text={s.caption} limit={260} />
                </li>
              ))}
            </ol>
            {e.response && (
              <Disclose label="what the trace changed">
                <Text>{e.response}</Text>
              </Disclose>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------- Four Prompts: by pair, or by assistant ---------- */

function Prompts({ entries }: { entries: PromptsEntry[] }) {
  const [by, setBy] = useState<'pair' | 'assistant'>('pair')
  const assistants = [...new Set(entries.flatMap((e) => e.responses.map((r) => r.assistant)))]

  return (
    <section className="writing__section">
      <div className="switch">
        <span className="label label--muted">read by</span>
        {(['pair', 'assistant'] as const).map((k) => (
          <button key={k} className={`label label--link${by === k ? ' is-active' : ''}`} onClick={() => setBy(k)}>
            {k}
          </button>
        ))}
      </div>

      {by === 'pair' &&
        entries.map((e) => (
          <article key={e.names.join()} className="pair">
            <Label className="label--student">{e.names.join(' + ')}</Label>
            <p className="pair__prompt">“{e.prompt}”</p>
            {e.followup && <p className="label label--muted label--keep">then: “{e.followup}”</p>}
            <div className="cards cards--4">
              {e.responses.map((r) => (
                <div key={r.assistant} className="card-text">
                  <Label className="label--keep">{r.assistant}</Label>
                  <Long text={r.summary} limit={360} />
                  {r.pushback && (
                    <div className="pushback">
                      <span className="label label--muted">when told it was wrong</span>
                      <Text>{r.pushback}</Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {e.verdict && (
              <div className="verdict">
                <span className="label label--muted">which one, and why</span>
                <Text>{e.verdict}</Text>
              </div>
            )}
          </article>
        ))}

      {by === 'assistant' && (
        <div className="cards cards--4">
          {assistants.map((a) => (
            <div key={a} className="column">
              <h2 className="writing__h2">{a}</h2>
              {entries.flatMap((e) =>
                e.responses
                  .filter((r) => r.assistant === a)
                  .map((r) => (
                    <div key={e.names.join() + a} className="card-text">
                      <Label className="label--student">{e.names.join(' + ')}</Label>
                      <p className="label label--muted label--keep">“{e.prompt}”</p>
                      <Long text={r.summary} limit={360} />
                      {r.pushback && (
                        <div className="pushback">
                          <span className="label label--muted">when told it was wrong</span>
                          <Text>{r.pushback}</Text>
                        </div>
                      )}
                    </div>
                  )),
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/* ---------- Five Levels: a staircase of use cases ---------- */

const LEVELS = ['agent with tools', 'storage + knowledge', 'memory + learning', 'multi-agent teams', 'production system']

function Levels({ entries }: { entries: LevelsEntry[] }) {
  const products = entries.filter((e) => e.product)
  const ideas = entries.filter((e) => e.visualize)
  return (
    <>
      <section className="writing__section">
        <div className="stairs">
          {LEVELS.map((name, i) => (
            <div key={name} className="stair" style={{ '--step': i } as React.CSSProperties}>
              <h2 className="writing__h2">
                {i + 1} · {name}
              </h2>
              {entries.flatMap((e) =>
                e.levels
                  .filter((l) => l.level === i + 1)
                  .map((l, j) => (
                    <div key={e.name + j} className="card-text">
                      <p className="stair__case">{l.case}</p>
                      {l.note && <Long text={l.note} limit={180} label="more" />}
                      <div className="stair__foot">
                        <Label className="label--student">{e.name}</Label>
                        {l.source && (
                          <a className="label label--link" href={l.source} target="_blank" rel="noreferrer">
                            source ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )),
              )}
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="writing__section">
          <h2 className="writing__h2">Products, classified</h2>
          <div className="cards">
            {products.map((e) => (
              <article key={e.name} className="card-text">
                <Label className="label--student">{e.name}</Label>
                <p className="stair__case">
                  {e.product!.name}
                  {e.product!.level ? <span className="label label--muted"> · level {e.product!.level}</span> : null}
                </p>
                <Long text={e.product!.text} />
              </article>
            ))}
          </div>
        </section>
      )}

      {ideas.length > 0 && (
        <section className="writing__section">
          <h2 className="writing__h2">How would you show it?</h2>
          <div className="cards">
            {ideas.map((e) => (
              <article key={e.name} className="card-text">
                <Label className="label--student">{e.name}</Label>
                <Long text={e.visualize} />
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
