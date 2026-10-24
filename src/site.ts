/** App name: browser tab title, favicon alt. */
export const APP_NAME = 'Student Work Viewer'

export interface CourseLink {
  label: string
  /** Absolute path on this domain, or a full URL. */
  href: string
  /** Shown on the right, like a showcase's due date. */
  note?: string
}

export interface Course {
  /** URL segment under /classes/ — lowercase, e.g. experimental-tools-f26. */
  slug: string
  code: string
  title: string
  /** Term code, e.g. F26. Showcases whose term matches (any case) belong to this course. */
  term: string
  /** Shown small under the title on the course page, behind a click. */
  description?: string
  /** Extra links on the course page (forms, assessments), listed under the showcases. */
  links: CourseLink[]
}

/**
 * Courses, newest first. Edit here, nowhere else. A showcase belongs to a course by
 * its term; if two courses ever run in the same term, give showcases a course column.
 */
export const COURSES: Course[] = [
  {
    slug: 'experimental-tools-f26',
    code: 'CDES 3110/6110',
    title: 'Experimental Tools and Technology',
    term: 'F26',
    description:
      'Experimental Tools and Technology is a course that explores and instrumentalizes recent technological advancements, such as Generative AI & Large Language Models, API Integrations, Data, Sensors, GPS, and Computer Vision. Experimental Tools and Technology prepares students to deploy these technologies in response to design prompts with the ultimate goal of problem solving in a design project context. Furthermore, we will contextualize these technologies to better understand how labor, information, technological development, and their social relation affect our ability to imagine different futures and different problem solving approaches.',
    links: [{ label: 'Midterm', href: '/classes/experimental-tools-f26/midterm', note: '20 november F26' }],
  },
]

export const coursePath = (c: Course) => `/classes/${c.slug}`

export function findCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug.toLowerCase())
}

/** The course a showcase belongs to, by term. */
export function courseForTerm(term: string): Course | undefined {
  return COURSES.find((c) => c.term.toLowerCase() === term.toLowerCase())
}
