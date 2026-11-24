import { useEffect, useState } from 'react'

interface Props {
  value: string
  onCommit: (value: string) => void
  placeholder?: string
  label?: string
  mono?: boolean
  className?: string
  /** Input type; defaults to text. */
  type?: 'text' | 'email'
  autoComplete?: string
  /** Called on every keystroke, for forms that validate as you type. */
  onInput?: (value: string) => void
  /** Called whenever the field loses focus, whether or not the value changed. */
  onBlur?: () => void
  /** Replaces the default Enter (blur and commit), e.g. to submit a form from its last field. */
  onEnter?: () => void
  /** Shown under the input when set. */
  error?: string
}

/**
 * Text input that commits on blur or Enter (event-driven — no save timers).
 * Keeps a local draft so typing never fights with props; resyncs when the
 * committed value changes from outside.
 */
export default function Field({
  value,
  onCommit,
  placeholder,
  label,
  className = '',
  type = 'text',
  autoComplete,
  onInput,
  onBlur,
  onEnter,
  error,
}: Props) {
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])

  const commit = () => {
    if (draft !== value) onCommit(draft)
  }

  return (
    <label className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      {label && <span className="label label--muted">{label}</span>}
      <input
        type={type}
        value={draft}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        onChange={(e) => {
          setDraft(e.target.value)
          onInput?.(e.target.value)
        }}
        onBlur={() => {
          commit()
          onBlur?.()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (onEnter) onEnter()
            else (e.target as HTMLInputElement).blur()
          }
          if (e.key === 'Escape') setDraft(value)
        }}
      />
      {error && <span className="label field__error">{error}</span>}
    </label>
  )
}
