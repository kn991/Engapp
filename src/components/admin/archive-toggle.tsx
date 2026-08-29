'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { setWordArchived } from '@/server/actions/admin'

export function ArchiveToggle({ wordId, archived }: { wordId: string; archived: boolean }) {
  const router = useRouter()
  const toast = useToast()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="quiet"
      size="sm"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await setWordArchived(wordId, !archived)
          if (!result.ok) toast.show(result.error, 'error')
          else router.refresh()
        })
      }
    >
      {archived ? 'Restore' : 'Archive'}
    </Button>
  )
}
