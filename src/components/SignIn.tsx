import { useState, type FormEvent } from 'react'
import Label from './Label'
import { supabase } from '../lib/supabase'

/** The one account allowed to sign in. */
const ADMIN_EMAIL = 'kevin@orpiment.studio'

/**
 * Sign in for the single admin with a one-time link emailed to ADMIN_EMAIL.
 * No password. The link returns to this page (Supabase → Authentication →
 * URL Configuration must allow https://gwdesign.kevinpatton.site/**).
 */
export default function SignIn() {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const send = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname },
    })
    setBusy(false)
    if (error) setMessage(error.message)
    else setSent(true)
  }

  return (
    <main className="notice">
      <form className="signin" onSubmit={send}>
        <Label className="label--student">sign in</Label>
        <Label className="label--muted">{ADMIN_EMAIL}</Label>
        {sent ? (
          <>
            <Label>check your email and open the sign-in link</Label>
            <button type="submit" className="label label--link text-button" disabled={busy}>
              send a new link
            </button>
          </>
        ) : (
          <button type="submit" className="text-button" disabled={busy}>
            {busy ? 'sending…' : 'email me a sign-in link'}
          </button>
        )}
        {message && <Label className="label--muted">{message}</Label>}
      </form>
    </main>
  )
}
