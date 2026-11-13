import type { ReactNode } from 'react'

/**
 * Course documents: briefs that are read, not filled in (the forms app handles those).
 * Each one is a page at /classes/<course>/<slug>, laid out like the midterm:
 * a contents bar on the left with the due date, the text on the right.
 */
export interface DocSection {
  /** Anchor id, also the contents-bar target. */
  id: string
  heading: string
  /** When set, the section's heading is a link to this address, opened in a new tab. */
  headingHref?: string
  body: ReactNode
  /** Short lines shown small, grey and indented under this section's link in the contents bar. */
  outline?: string[]
  /** Sections marked `paired` sit side by side in two columns from 900px up. */
  paired?: boolean
}

export interface Doc {
  slug: string
  /** The course's term; the back link and the course page find the course by it. */
  term: string
  title: string
  subtitle: string
  /** Shown at the top of the contents bar and under the title, e.g. "Tue 17 Nov". */
  due: string
  intro?: ReactNode
  sections: DocSection[]
}

/** Revised proposals go here for Dec 1 (class does not meet that day). */
const REVISED_PROPOSALS_FOLDER = 'https://drive.google.com/drive/folders/123GG_zA0DWBkvMo8rA9VGYYx3nebaqkH'

/** The published web version of For Further Investigation, card view. */
const FURTHER_INVESTIGATION_URL =
  'https://sweltering-walk-e46.notion.site/90cbf4cea80f480b85c59305c5751e4c?v=a31f4b9b5e6b454394b67b9d4e94ec86'

function FurtherInvestigation() {
  return FURTHER_INVESTIGATION_URL ? (
    <a href={FURTHER_INVESTIGATION_URL} target="_blank" rel="noreferrer">
      For Further Investigation
    </a>
  ) : (
    <>For Further Investigation</>
  )
}

const FINAL_PROPOSAL: Doc = {
  slug: 'final-proposal',
  term: 'F26',
  title: 'Final Project Proposal',
  subtitle: 'CIXD/CDES 3110/6110 Experimental Tools and Technology, Fall 2026.',
  due: 'Tue 17 Nov, 13:00',
  intro: (
    <p>
      The final project is open. You choose the topic, but it has to grow out of something we’ve done in class this
      semester. You might go further with one of our tools or methods, or combine two of them.
    </p>
  ),
  sections: [
    {
      id: 'schedule',
      heading: 'Schedule',
      paired: true,
      outline: [
        'Tue 17 Nov: present your idea for crit',
        'Tue 1 Dec: revised proposal due (no class)',
        'Tue 8 Dec: progress demo and feedback',
        'Tue 15 Dec: final project due',
      ],
      body: (
        <>
          <ul>
            <li>
              <strong>Tuesday, Nov 17:</strong> present your idea in class for crit.
            </li>
            <li>
              <strong>Tuesday, Dec 1:</strong> turn in a revised proposal that responds to the crit. Class doesn’t meet
              that day. Upload it to the{' '}
              <a href={REVISED_PROPOSALS_FOLDER} target="_blank" rel="noreferrer">
                Final Project Revised Proposals
              </a>{' '}
              folder.
            </li>
            <li>
              <strong>Tuesday, Dec 8:</strong> demonstrate your progress in class and get feedback.
            </li>
            <li>
              <strong>Tuesday, Dec 15:</strong> final project due.
            </li>
          </ul>
          <p className="doc__notice">
            <span>
              Projects not turned in by <span className="doc__accent doc__nowrap">Dec 15 at 23:59</span> will receive a 0.
            </span>
          </p>
        </>
      ),
    },
    {
      id: 'directions',
      heading: 'Directions',
      paired: true,
      outline: [
        'A working title',
        'Where it comes from',
        'What you will make',
        'The question or idea driving it',
        'Tools and materials',
        'Bibliography: 3+ from For Further Investigation',
        'Deliverables',
      ],
      body: (
        <ol>
          <li>A working title.</li>
          <li>Where it comes from: which class, assignment or tool it builds on.</li>
          <li>What you will make, in a few sentences.</li>
          <li>The question or idea driving it. What do you want to find out?</li>
          <li>Tools and materials.</li>
          <li>
            A bibliography of at least three articles from <FurtherInvestigation />, our database of readings and
            resources. You can add sources from outside it as well. Use the citations in the database’s Citation field.
          </li>
          <li>What deliverables will best demonstrate your project’s outcomes?</li>
        </ol>
      ),
    },
    {
      id: 'project-ideas',
      heading: 'Possible Project Ideas',
      body: (
        <ul>
          <li>
            <strong>An essay on the ethics of a technology we’ve studied</strong> (Classes 1–3: Surveillance
            Capitalism, Futures Past, Labor and the Self, along with the readings and conversations that carried these
            questions through the rest of the semester). It should be about 6,000 words, with a clear question, real
            research and sources, and close attention to how the technology works.
          </li>
          <li>
            <strong>Information architecture</strong> (Classes 3 and 5: Labor and Information, Organizational
            Structures for Productivity and Agents). Design a novel information system for a specific context. Look past
            the tools themselves to the structures they’re built on, such as kanban boards, Gantt charts, timelines,
            hierarchies and linked notes. What does each structure make visible, and what does it leave out? One example
            is a system for tracking your own student career: what goes in, how it moves, and how you find it again.
            Notion, Obsidian or an agent can be how you build it. Use schematics and diagrams, as well as prose and
            quotes from our sources.
          </li>
          <li>
            <strong>Web design with MCP and skills</strong> (Classes 4–6: GitHub and Vercel, Prompting, Agents and
            Hermes). Build a site or web tool with an agent, using MCP servers and skills you write or configure. Show
            the process as well as the result.
          </li>
          <li>
            <strong>Local models</strong> (Classes 7–9: Running a Local LLM, Weights and Data, Variable Machine). Run,
            adapt or train a model on your own machine, and build something with it: a tool, an installation, an
            experiment. Document how it behaves.
          </li>
          <li>
            <strong>Blender</strong> (Classes 10–11: Animation and 3D, Real-Time Media Tools). Build on Grease Pencil,
            or move into 3D. This could be an animation, a scene or an environment.
          </li>
          <li>
            <strong>TouchDesigner</strong> (Classes 11–12). A real-time or interactive piece that responds to sound,
            video, data or a person.
          </li>
        </ul>
      ),
    },
    {
      id: 'further-investigation',
      heading: 'For Further Investigation | Resources',
      headingHref: FURTHER_INVESTIGATION_URL,
      body: (
        <p>
          <FurtherInvestigation /> is organized by class. Start with the class your project grows out of, and look past
          the assigned readings: most entries are there for exactly this kind of project.
        </p>
      ),
    },
    {
      id: 'format',
      heading: 'Format',
      outline: ['1 page + sketch'],
      body: (
        <p>
          Keep it to about a page, plus a sketch, diagram or screenshot if it helps. Bring it to class on Tuesday,
          November 17, for crit.
        </p>
      ),
    },
  ],
}

export const DOCS: Doc[] = [FINAL_PROPOSAL]

export function findDoc(slug: string): Doc | undefined {
  return DOCS.find((d) => d.slug === slug)
}
