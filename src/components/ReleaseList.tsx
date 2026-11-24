import ConfirmButton from './ConfirmButton'
import Label from './Label'
import { choiceLabel } from '../releaseCopy'
import type { Release } from '../types'

interface Props {
  releases: Release[]
  onWithdraw: (id: string) => void
}

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase()

/** Where a release allows the work to be shown, in the admin's shorthand. */
function where(r: Release) {
  if (r.choice === 'none') return '—'
  const places = [r.show_on_viewer && 'viewer', r.show_in_program && 'program'].filter(Boolean)
  return places.length ? places.join(' + ') : 'nowhere checked'
}

/** Releases newest first: name, choice, where, date, and a two-step "mark withdrawn". */
export default function ReleaseList({ releases, onWithdraw }: Props) {
  if (!releases.length) return <Label className="label--muted">no releases yet</Label>
  return (
    <ul className="release-list">
      {releases.map((r) => (
        <li key={r.id} className={`release-row ${r.withdrawn_at ? 'is-withdrawn' : ''}`.trim()}>
          <span className="release-row__name">{r.name}</span>
          <span>{choiceLabel(r.choice)}</span>
          <Label className="label--muted">{where(r)}</Label>
          <Label className="label--muted label--keep">
            {shortDate(r.created_at)} · {r.course} · {r.term}
          </Label>
          <span className="release-row__tools">
            {r.withdrawn_at ? (
              <Label className="label--muted">withdrawn {shortDate(r.withdrawn_at)}</Label>
            ) : (
              <ConfirmButton label="mark withdrawn" confirmLabel="withdraw?" onConfirm={() => onWithdraw(r.id)} />
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
