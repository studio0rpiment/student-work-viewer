import networks from './networks-tokens-embeddings.entries.json'
import anatomy from './anatomy-of-an-ai-system.entries.json'
import fourPrompts from './four-prompts.entries.json'
import fiveLevels from './five-levels.entries.json'
import handDrawn from './hand-drawn.entries.json'
import variableMachine from './variable-machine.entries.json'
import type { LevelsEntry, MediaEntry, PathEntry, PromptsEntry, QuestionsEntry, Writing } from './types'

/**
 * Written assignments. Briefs are condensed from Lecture Materials F26 in Notion;
 * entries come from the students' Drive submissions (first names only).
 */
export const WRITINGS: Writing[] = [
  {
    slug: 'networks-tokens-embeddings',
    title: 'Networks, Tokens, Embeddings',
    term: 'F26',
    due_date: '2026-09-15',
    summary: 'Three browser tools that make the numbers inside a language model visible.',
    layout: 'questions',
    brief: [
      { p: 'An in-class read-along in three browser tools: TensorFlow Playground, the Tokenizer Playground, and the Embedding Projector.' },
      { h: 'Record' },
      {
        list: [
          'Networks: "When I changed ___, the output boundary ___."',
          'Tokens: starting from "A command line can connect tools.", "I changed ___. The tokenizer changed ___."',
          'Embeddings: two nearby terms, two distant terms, one possible relationship.',
        ],
      },
      { q: 'What did the TensorFlow Playground make visible about training that was not visible in the 3Blue1Brown video?' },
    ],
    entries: networks as QuestionsEntry[],
  },
  {
    slug: 'anatomy-of-an-ai-system',
    title: 'Anatomy of an AI System',
    term: 'F26',
    due_date: '2026-09-15',
    summary: 'One path outward from the Amazon Echo through Crawford and Joler’s map.',
    layout: 'path',
    brief: [
      { p: 'Open Anatomy of an AI System by Kate Crawford and Vladan Joler. Select one path through the map beginning with the Amazon Echo and follow it outward through at least three connected elements: one material or environmental system, one form of human labour, and one computing, data, or network system. Pick the path you know least about.' },
      { p: 'Submit the path, labels for the three elements, a 40–75 word caption for each, and a 150–250 word response:' },
      { q: 'How does tracing this path change the description of an AI system from “a model that processes information” to “a physical infrastructure”?' },
    ],
    entries: anatomy as PathEntry[],
  },
  {
    slug: 'four-prompts',
    title: 'Four Prompts',
    term: 'F26',
    due_date: '2026-09-15',
    summary: 'One prompt, run unchanged in four assistants.',
    layout: 'prompts',
    brief: [
      { p: 'In pairs. Write one prompt related to a current project and run it, unchanged, in four different assistants. Record for each: what it assumed without asking, what it refused or hedged, whether it searched, what format it chose on its own, and how long the answer was.' },
      { p: 'Then a second pass on one of them: tell it that its answer was wrong and watch what it does.' },
      { q: 'We are not ranking them. We are building a description of four different defaults, and a default is a design decision somebody made on your behalf.' },
      { p: 'Deliverable: the prompt, the four responses summarized, and two sentences on which one you would use and why.' },
    ],
    entries: fourPrompts as PromptsEntry[],
  },
  {
    slug: 'five-levels',
    title: 'Five Levels of Agentic Software',
    term: 'F26',
    due_date: '2026-10-06',
    summary: 'What changes as a system moves from answering to acting.',
    layout: 'levels',
    brief: [
      { p: 'When a system only answers, the design object is the screen. When a system acts, the design object becomes delegation, legibility, and recovery.' },
      {
        list: [
          'Walk the levels: one use case for each level of agentic use, from the Hermes user stories.',
          'Classify: track one commercial product that promises agentic teams from prompt to task completion. Anything novel?',
          'Visualize: how would you show users what these agents do — how they move, and how to represent time?',
        ],
      },
      { p: 'Deliverable: one product classified, with a paragraph on the design obligations attaching at its level and whether the product meets them.' },
    ],
    entries: fiveLevels as LevelsEntry[],
  },
  {
    slug: 'variable-machine',
    title: 'Variable Machine',
    term: 'F26',
    due_date: '2026-10-27',
    summary: 'A model of your own: use, steer and train a small model on your own Mac.',
    layout: 'packed',
    brief: [
      { p: 'Variable Machine is a small localhost instrument that trains, blends and exports small models on an ordinary Mac, and echoes every command into a terminal on the same page. In groups, choose one of four worked demos (public data, gallery, gesture, tangible), make it work as it is, then retrain it on your own data for a project you care about.' },
      { h: 'Use, steer, train' },
      {
        list: [
          'Use: your input goes through a ready-made model and nothing in it changes.',
          'Steer: your input points the model at the outcome you want, this time.',
          'Train: your examples change the model. The change stays, and someone else can use it.',
        ],
      },
      { q: 'You can now put a lens into a machine and hand it to someone else. Who should have this model, and who shouldn’t?' },
    ],
    entries: variableMachine as MediaEntry[],
  },
  {
    slug: 'hand-drawn',
    title: 'Hand Drawn: Logo Set or Alphabet',
    term: 'F26',
    due_date: '2026-10-27',
    summary: 'Drawn by hand, photographed, and turned into clean marks or a working typeface.',
    layout: 'media',
    brief: [
      { p: 'Draw by hand, photograph the sheets, and use the Hand Drawn app to turn the drawings into clean SVG marks or a working typeface. There are no models or machine learning in the app.' },
      { p: 'Make either a logo set or an alphabet.' },
    ],
    entries: handDrawn as MediaEntry[],
  },
]

export function findWriting(slug: string): Writing | undefined {
  return WRITINGS.find((w) => w.slug === slug)
}
