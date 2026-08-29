'use client'

import { useState } from 'react'
import { DownloadIcon, LogoutIcon, TrashIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Field, Input } from '@/components/ui/input'
import { SectionTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { signOut } from '@/server/actions/auth'
import { deleteAccount } from '@/server/actions/settings'

export function DangerZone() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setBusy(true)
    setError(null)
    const result = await deleteAccount({ confirmation })
    // A successful delete redirects, so reaching here means it failed.
    setBusy(false)
    if (result && !result.ok) setError(result.error)
  }

  async function handleExport() {
    try {
      const response = await fetch('/api/export')
      if (!response.ok) throw new Error('export failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `verba-export-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.show('We could not build your export. Try again in a moment.', 'error')
    }
  }

  return (
    <section className="space-y-3">
      <SectionTitle>Privacy</SectionTitle>

      <Button variant="secondary" fullWidth onClick={handleExport} type="button">
        <DownloadIcon size={18} />
        Export my data
      </Button>

      <form action={signOut}>
        <Button variant="secondary" fullWidth type="submit">
          <LogoutIcon size={18} />
          Log out
        </Button>
      </form>

      <Button
        variant="ghost"
        fullWidth
        className="text-[var(--danger)]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <TrashIcon size={18} />
        Delete account
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete your account?"
        description="Your profile, words, review history and progress are removed permanently. This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={busy}
              disabled={confirmation !== 'DELETE'}
              onClick={handleDelete}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <Field label="Type DELETE to confirm" htmlFor="confirmation" error={error ?? undefined}>
          <Input
            id="confirmation"
            value={confirmation}
            autoCapitalize="characters"
            autoCorrect="off"
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </Field>
      </Dialog>
    </section>
  )
}
