import { useState, type FormEvent } from 'react'
import Label from './Label'
import { supabase } from '../lib/supabase'

/** The one account allowed to sign in. */
const ADMIN_EMAIL = 'kevin@orpiment.studio'

/**
 * Sign in for the single admin with a fixed code: the Supabase password of
 * ADMIN_EMAIL, set with SQL (see README). Backup: a one-time link emailed to
 * ADMIN_EMAIL, which returns to this page.
 */
export default function SignIn() {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const signIn = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || !code.trim()) return
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: code.trim() })
    setBusy(false)
    if (error) setMessage(error.message === 'Invalid login credentials' ? 'wrong code' : error.message)
    // on success the auth state event re-renders the page
  }

  const sendLink = async () => {
    if (!supabase) return
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname },
    })
    setBusy(false)
    setMessage(error ? error.message : 'check your email and open the sign-in link')
  }

  return (
    <main className="notice">
      <form className="signin" onSubmit={signIn}>
        <Label className="label--student">sign in</Label>
        <Label className="label--muted">{ADMIN_EMAIL}</Label>
        <input
          type="password"
          value={code}
          placeholder="code"
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="text-button" disabled={busy || !code.trim()}>
          sign in
        </button>
        <button type="button" className="label label--link text-button" disabled={busy} onClick={sendLink}>
          or email me a sign-in link
        </button>
        {message && <Label className="label--muted">{message}</Label>}
      </form>
    </main>
  )
}
