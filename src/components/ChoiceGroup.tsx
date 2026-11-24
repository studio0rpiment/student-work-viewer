import type { ReactNode } from 'react'

interface Option<T extends string> {
  value: T
  label: string
}

interface BaseProps<T extends string> {
  /** Shared input name; also ties the options together for keyboard use. */
  name: string
  legend: ReactNode
  hint?: string
  options: Option<T>[]
  onBlur?: () => void
}

interface RadioProps<T extends string> extends BaseProps<T> {
  multiple?: false
  value: T | null
  onChange: (value: T) => void
}

interface CheckProps<T extends string> extends BaseProps<T> {
  multiple: true
  value: T[]
  onChange: (value: T[]) => void
}

/**
 * A list of radios (choose one) or checkboxes (multiple), drawn as KP Minimal
 * outline marks rather than browser defaults. Real inputs underneath, so
 * keyboard and screen readers work as usual.
 */
export default function ChoiceGroup<T extends string>(props: RadioProps<T> | CheckProps<T>) {
  const { name, legend, hint, options, onBlur } = props
  const kind = props.multiple ? 'checkbox' : 'radio'

  const isOn = (v: T) => (props.multiple ? props.value.includes(v) : props.value === v)
  const pick = (v: T, checked: boolean) => {
    if (props.multiple) props.onChange(checked ? [...props.value, v] : props.value.filter((x) => x !== v))
    else props.onChange(v)
  }

  return (
    <fieldset className="choices" onBlur={onBlur}>
      <legend className="choices__legend">
        {legend}
        {hint && <span className="label label--muted"> ({hint})</span>}
      </legend>
      {options.map((o) => (
        <label key={o.value} className={`choice choice--${kind}`}>
          <input
            type={kind}
            name={name}
            value={o.value}
            checked={isOn(o.value)}
            onChange={(e) => pick(o.value, e.target.checked)}
          />
          <span className="choice__mark" aria-hidden="true" />
          <span className="choice__label">{o.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
