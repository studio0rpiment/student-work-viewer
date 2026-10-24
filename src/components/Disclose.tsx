import type { ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
  className?: string
}

/**
 * Small click-to-open block with the hand-drawn triangle from hand-icons:
 * points right while closed, down when open. Used for the course description,
 * assignment briefs and long student texts.
 */
export default function Disclose({ label, children, className = '' }: Props) {
  return (
    <details className={`disclose ${className}`.trim()}>
      <summary className="label label--link">
        <span className="tri" aria-hidden="true" />
        {label}
      </summary>
      <div className="disclose__body">{children}</div>
    </details>
  )
}
