import { useState, type FormEvent } from 'react'
import Label from './Label'
import { supabase } from '../lib/supabase'

/** The one account allowed to sign in. */
const ADMIN_EMAIL = 'kevin@orpiment.studio'

/**
 * Sign in for the single admin with a one-time code emailed to ADMIN_EMAIL.
 * The email also carries a sign-in link, which works too. No password.
 */
export default function SignIn() {
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const send = async () => {
    if (!supabase) return
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { shouldCreateUser: false, emailRedirectTo: location.href },
    })
    setBusy(false)
    if (error) setMessage(error.message)
    else setSent(true)
  }

  const verify = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (!sent) return send()
    setBusy(true)
    const { error } = await supabase.auth.verifyOtp({ email: ADMIN_EMAIL, token: code.trim(), type: 'email' })
    setBusy(false)
    if (error) setMessage(error.message)
    // on success the auth state event re-renders the page
  }

  return (
    <main className="notice">
      <form className="signin" onSubmit={verify}>
        <Label className="label--student">sign in</Label>
        <Label className="label--muted">{ADMIN_EMAIL}</Label>
        {sent ? (
          <>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              placeholder="code from the email"
              autoFocus
              required
              autoComplete="one-time-code"
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className="text-button" disabled={busy || !code.trim()}>
              sign in
            </button>
            <button type="button" className="label label--link text-button" disabled={busy} onClick={send}>
              send a new code
            </button>
          </>
        ) : (
          <button type="submit" className="text-button" disabled={busy}>
            {busy ? 'sending…' : 'email me a code'}
          </button>
        )}
        {message && <Label className="label--muted">{message}</Label>}
      </form>
    </main>
  )
}
