import { useEffect, useState } from 'react'
import Label from '../components/Label'
import ReleaseList from '../components/ReleaseList'
import SignIn from '../components/SignIn'
import { useSession } from '../hooks/useSession'
import { listReleases, withdrawRelease } from '../lib/data'
import { supabase } from '../lib/supabase'
import type { Release } from '../types'

interface Props {
  navigate: (path: string) => void
}

/** /edit/releases — every student's release, newest first. Signed in only. */
export default function ReleasesPage({ navigate }: Props) {
  const { session, ready } = useSession()
  const [releases, setReleases] = useState<Release[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Releases'
    if (session) listReleases().then(setReleases).catch((e: Error) => setError(e.message))
  }, [session])

  if (!supabase) return null
  if (!ready) return null
  if (!session) return <SignIn />

  const withdraw = async (id: string) => {
    try {
      const at = await withdrawRelease(id)
      setReleases((rs) => rs?.map((r) => (r.id === id ? { ...r, withdrawn_at: at } : r)) ?? null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <main className="editor">
      <header className="editor__head">
        <Label className="label--student">releases</Label>
        <nav className="editor__nav">
          <a
            className="label label--link"
            href="/edit"
            onClick={(e) => {
              e.preventDefault()
              navigate('/edit')
            }}
          >
            ← showcases
          </a>
          <a className="label label--link" href="/release" target="_blank" rel="noreferrer">
            the form ↗
          </a>
        </nav>
      </header>
      {error && <Label className="label--muted">{error}</Label>}
      {releases && <ReleaseList releases={releases} onWithdraw={withdraw} />}
    </main>
  )
}
