'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TrashIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { deleteCustomWord } from '@/server/actions/words'

export function DeleteCustomWord({ wordId, lemma }: { wordId: string; lemma: string }) {
  const router = useRouter()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function confirm() {
    setBusy(true)
    const result = await deleteCustomWord(wordId)
    setBusy(false)
    if (!result.ok) {
      toast.show(result.error, 'error')
      return
    }
    setOpen(false)
    router.push('/words')
    router.refresh()
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="text-[var(--danger)]" onClick={() => setOpen(true)}>
        <TrashIcon size={18} />
        Delete this word
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Delete “${lemma}”?`}
        description="Its review history goes with it. This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep it
            </Button>
            <Button variant="danger" loading={busy} onClick={confirm}>
              Delete
            </Button>
          </>
        }
      />
    </>
  )
}
