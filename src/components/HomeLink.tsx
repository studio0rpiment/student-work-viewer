import { coursePath, type Course } from '../site'

interface Props {
  /** The showcase's course; without one the link goes to the list of classes. */
  course?: Course
  navigate: (path: string) => void
}

/** Course title and term, top centre, half-strength — the way back to the course page. */
export default function HomeLink({ course, navigate }: Props) {
  const href = course ? coursePath(course) : '/classes'
  return (
    <a
      className="home-link"
      href={href}
      onClick={(e) => {
        e.preventDefault()
        navigate(href)
      }}
    >
      {course ? `${course.title} ${course.term}` : 'classes'}
    </a>
  )
}
