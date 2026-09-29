import { COURSE } from '../site'

interface Props {
  navigate: (path: string) => void
}

/** Course title, top centre, half-strength — the way back to the front page. */
export default function HomeLink({ navigate }: Props) {
  return (
    <a
      className="home-link"
      href="/"
      onClick={(e) => {
        e.preventDefault()
        navigate('/')
      }}
    >
      {COURSE.title}
    </a>
  )
}
