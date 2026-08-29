'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DownloadIcon, UploadIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { VOCABULARY_CSV_TEMPLATE } from '@/lib/csv'
import { importCustomWords, type ImportSummary } from '@/server/actions/words'

/** CSV import with a preview of what failed, so nothing is dropped silently. */
export function ImportWords() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [summary, setSummary] = useState<ImportSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setBusy(true)
    setError(null)
    setSummary(null)
    try {
      const text = await file.text()
      const result = await importCustomWords(text)
      if (!result.ok) setError(result.error)
      else {
        setSummary(result.data)
        router.refresh()
      }
    } catch {
      setError('That file could not be read.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function downloadTemplate() {
    const blob = new Blob([VOCABULARY_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'verba-vocabulary-template.csv'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          loading={busy}
          onClick={() => fileRef.current?.click()}
          type="button"
        >
          <UploadIcon size={18} />
          Import CSV
        </Button>
        <Button variant="ghost" size="sm" onClick={downloadTemplate} type="button">
          <DownloadIcon size={18} />
          Template
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          aria-label="Choose a CSV file"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void handleFile(file)
          }}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {summary && (
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-3 text-sm">
          <p>
            Imported {summary.imported}. Skipped {summary.skipped}.
          </p>
          {summary.issues.length > 0 && (
            <ul className="mt-2 space-y-1 text-[var(--muted)]">
              {summary.issues.slice(0, 8).map((issue) => (
                <li key={issue.row}>
                  Row {issue.row}: {issue.message}
                </li>
              ))}
              {summary.issues.length > 8 && <li>and {summary.issues.length - 8} more…</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
