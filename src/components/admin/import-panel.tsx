'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DownloadIcon, UploadIcon } from '@/components/icons'
import { VOCABULARY_CSV_TEMPLATE } from '@/lib/csv'
import {
  commitCuratedImport,
  previewCuratedImport,
  type AdminImportPreview,
} from '@/server/actions/admin'

/** Validate first, show exactly what will happen, then write. */
export function ImportPanel() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [csv, setCsv] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<AdminImportPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  async function choose(file: File) {
    setError(null)
    setDone(null)
    setPreview(null)
    setBusy(true)
    try {
      const text = await file.text()
      setCsv(text)
      setFileName(file.name)
      const result = await previewCuratedImport(text)
      if (!result.ok) setError(result.error)
      else setPreview(result.data)
    } catch {
      setError('That file could not be read.')
    } finally {
      setBusy(false)
    }
  }

  async function commit() {
    if (!csv) return
    setBusy(true)
    setError(null)
    const result = await commitCuratedImport(csv)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDone(`Imported ${result.data.imported} words. Skipped ${result.data.skipped}.`)
    setPreview(null)
    setCsv(null)
    setFileName(null)
    if (fileRef.current) fileRef.current.value = ''
    router.refresh()
  }

  function downloadTemplate() {
    const blob = new Blob([VOCABULARY_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'verba-curated-template.csv'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" loading={busy} onClick={() => fileRef.current?.click()}>
          <UploadIcon size={18} />
          Choose CSV
        </Button>
        <Button variant="ghost" onClick={downloadTemplate}>
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
            if (file) void choose(file)
          }}
        />
      </div>

      {fileName && <p className="text-sm text-[var(--muted)]">{fileName}</p>}

      {error && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
      {done && (
        <p role="status" className="text-sm text-[var(--success)]">
          {done}
        </p>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              New <strong className="tabular">{preview.validCount}</strong>
            </span>
            <span className="text-[var(--muted)]">
              Duplicates <strong className="tabular">{preview.duplicateCount}</strong>
            </span>
            <span className="text-[var(--danger)]">
              Invalid <strong className="tabular">{preview.invalidCount}</strong>
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)]">
            <table className="w-full text-sm">
              <caption className="sr-only">Rows found in the uploaded file</caption>
              <thead className="sticky top-0 bg-[var(--surface-2)] text-left">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Row
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Lemma
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row) => (
                  <tr key={row.row} className="border-t border-[var(--border)]">
                    <td className="tabular px-3 py-2 text-[var(--muted)]">{row.row}</td>
                    <td className="px-3 py-2" lang="en">
                      {row.lemma || '—'}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          row.status === 'invalid'
                            ? 'text-[var(--danger)]'
                            : row.status === 'duplicate'
                              ? 'text-[var(--muted)]'
                              : 'text-[var(--success)]'
                        }
                      >
                        {row.status}
                      </span>
                      {row.message && (
                        <span className="block text-xs text-[var(--muted)]">{row.message}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button loading={busy} disabled={preview.validCount === 0} onClick={commit}>
            Import {preview.validCount} words
          </Button>
        </div>
      )}
    </div>
  )
}
