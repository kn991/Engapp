'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  /** Hides the title visually while keeping it for screen readers. */
  hideTitle?: boolean
}

/**
 * Built on the native `<dialog>` element, which gives focus trapping, the
 * top layer and Escape handling for free rather than reimplementing them.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  hideTitle,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }
    node.addEventListener('cancel', handleCancel)
    return () => node.removeEventListener('cancel', handleCancel)
  }, [onClose])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={cn(
        'w-[calc(100vw-2rem)] max-w-md rounded-[var(--radius-lg)] border border-[var(--border)]',
        'bg-[var(--surface)] p-0 text-[var(--text)] shadow-[var(--shadow-pop)]',
        'backdrop:bg-black/40 backdrop:backdrop-blur-[1px]',
        'open:animate-pop m-auto'
      )}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0 pt-1">
          <h2 className={cn('font-display text-lg', hideTitle && 'sr-only')}>{title}</h2>
          {description && <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>}
        </div>
        <IconButton label="Close" onClick={onClose} className="-mr-2">
          <CloseIcon />
        </IconButton>
      </div>
      {children && <div className="px-5 py-4">{children}</div>}
      {footer && (
        <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] px-5 py-4 sm:flex-row sm:justify-end">
          {footer}
        </div>
      )}
    </dialog>
  )
}
