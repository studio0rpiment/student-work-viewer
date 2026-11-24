/**
 * Every word of the student work release form (/release) and its confirmation.
 * Student-facing copy is Kevin's, word for word; edit it here and nowhere else.
 *
 * Still to confirm with Kevin:
 *   - CONTACT_EMAIL (empty until he gives it; the confirmation then says "email me")
 *   - TURNAROUND ("usually within a week")
 *   - whether to keep the second "Where?" option (PLACES.program)
 */

/** The address students write to when they change their mind. */
export const CONTACT_EMAIL = ''

/** How soon a change takes effect. */
export const TURNAROUND = 'usually within a week'

export const TITLE = 'Permission to Show Your Work — Experimental Tools (CIXD 3110/6110), Fall 2026'

export const INTRO =
  "Work from this course is shown on the GW IxD Student Work Viewer. The site is public. I'd like your written permission before your work appears there or anywhere else. Your answer covers all of your work from this course. Saying no has no effect on your grade, and you can change your mind at any time."

export type ReleaseChoice = 'full' | 'first' | 'anonymous' | 'none'

export const CHOICES: { value: ReleaseChoice; label: string }[] = [
  { value: 'full', label: 'Yes, with my full name' },
  { value: 'first', label: 'Yes, with my first name only' },
  { value: 'anonymous', label: 'Yes, anonymously (no name)' },
  { value: 'none', label: "No, don't show my work" },
]

export type ReleasePlace = 'viewer' | 'program'

export const PLACES: Record<ReleasePlace, string> = {
  viewer: 'Student Work Viewer (public website)',
  program: 'Corcoran and GW Design materials (program website, social media, admissions, exhibitions)',
}

export const Q = {
  identity: 'Name and email',
  name: 'name',
  email: 'email',
  choice: 'May I show your work from this course?',
  choiceHint: 'choose one',
  where: 'Where?',
  whereHint: 'check all that apply',
  others: 'Material from others.',
  othersBody:
    "Your work may include 3D models, images, audio or code made by other people. It can only be shown where their licenses allow it. If anything is unclear, I'll check with you first.",
  change: 'Changing your mind.',
  changeBody: `Email me at any time and I'll take your work down or change how you're credited, ${TURNAROUND}.`,
  agreement: 'Agreement.',
  agreementBody: 'Type your full name. The date is filled in automatically.',
  agreedName: 'full name',
  date: 'date',
  submit: 'submit',
  sending: 'sending…',
}

/** Shown on a field the student has touched and left invalid. */
export const ERRORS = {
  name: 'your name is needed',
  email: 'use your GWU email (@gwu.edu or @gwmail.gwu.edu)',
  notOnList: "That email isn't on the class list. Use the GWU email your midterm code was sent to.",
  agreedName: 'type your full name to agree',
  failed: "That didn't go through. Check your connection and submit again.",
}

/** The confirmation that replaces the form after a successful submit. */
export const DONE = {
  heading: 'Thank you. Your answer is saved.',
  youChose: 'You chose:',
  where: 'Where:',
  nowhere: 'nowhere yet (no place was checked)',
  change: () =>
    `To change your mind, email me${CONTACT_EMAIL ? ` at ${CONTACT_EMAIL}` : ''}. I'll take your work down or change how you're credited, ${TURNAROUND}.`,
}

export const choiceLabel = (c: ReleaseChoice) => CHOICES.find((x) => x.value === c)?.label ?? c
