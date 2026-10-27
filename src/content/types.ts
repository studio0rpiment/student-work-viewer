/**
 * Written assignments, shown as text showcases. Each lives in src/content as a
 * brief (here, in index.ts) plus an entries file extracted from the students'
 * submissions. First names only.
 */

/** A brief is a few simple blocks — no markdown parser needed. */
export type BriefBlock =
  | { p: string }
  | { list: string[] }
  | { q: string } // the assignment's question, set apart
  | { h: string }

interface WritingBase {
  slug: string
  title: string
  /** Matches a course's term, like showcases do. */
  term: string
  /** ISO date (YYYY-MM-DD). */
  due_date: string
  /** One line under the title. */
  summary: string
  brief: BriefBlock[]
}

/** Networks, Tokens, Embeddings: the same four questions, read across the class. */
export interface QuestionsEntry {
  name: string
  networks: string | null
  tokens: string | null
  embeddings: { word: string | null; near: string[]; far: string[]; relationship: string | null } | null
  closing: string | null
}

/** Anatomy of an AI System: one traced path per student. */
export interface PathEntry {
  name: string
  title: string | null
  stops: { kind: 'material' | 'labour' | 'computing' | 'other'; label: string; caption: string | null }[]
  response: string | null
}

/** Four Prompts: one prompt, four assistants, a push back, a verdict. */
export interface PromptsEntry {
  names: string[]
  prompt: string
  followup: string | null
  responses: { assistant: string; summary: string | null; pushback: string | null }[]
  verdict: string | null
}

/** Five Levels of Agentic Software: one use case per level, a product, an idea. */
export interface LevelsEntry {
  name: string
  levels: { level: number; case: string; note: string | null; source: string | null }[]
  product: { name: string; level: number | null; text: string | null } | null
  visualize: string | null
}

/** Visual work: drawings, marks, screenshots, typefaces, screen recordings. */
export interface MediaItem {
  src: string
  kind: 'image' | 'video' | 'font'
  caption: string | null
}

/** One student, or one group (with members, and optionally each member's own take). */
export interface MediaEntry {
  name: string
  members?: string[]
  note?: string
  items: MediaItem[]
  solo?: { name: string; items: MediaItem[] }[]
}

export type Writing =
  | (WritingBase & { layout: 'questions'; entries: QuestionsEntry[] })
  | (WritingBase & { layout: 'path'; entries: PathEntry[] })
  | (WritingBase & { layout: 'prompts'; entries: PromptsEntry[] })
  | (WritingBase & { layout: 'levels'; entries: LevelsEntry[] })
  | (WritingBase & { layout: 'media'; entries: MediaEntry[] })
