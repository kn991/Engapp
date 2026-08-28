import type { Metadata } from 'next'
import Link from 'next/link'
import { ImportPanel } from '@/components/admin/import-panel'
import { VOCABULARY_CSV_COLUMNS } from '@/lib/csv'

export const metadata: Metadata = {
  title: 'Import vocabulary',
  robots: { index: false, follow: false },
}

export default function AdminImportPage() {
  return (
    <div className="space-y-5">
      <Link href="/admin" className="text-sm text-[var(--muted)] underline-offset-4 hover:underline">
        Back to words
      </Link>
      <div>
        <h1 className="font-display text-[1.5rem]">Import curated vocabulary</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Columns: {VOCABULARY_CSV_COLUMNS.join(', ')}. The first four are required. Nothing is
          written until you confirm the preview.
        </p>
      </div>
      <ImportPanel />
    </div>
  )
}
