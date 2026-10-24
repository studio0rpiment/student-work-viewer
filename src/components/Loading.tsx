/** Rotating glasses while something loads (styled in index.html, so it also shows before the app starts). */
export default function Loading() {
  return (
    <div className="loading" role="status" aria-label="loading">
      <span aria-hidden="true">👓</span>
    </div>
  )
}
