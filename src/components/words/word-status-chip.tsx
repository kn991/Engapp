import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type WordStatus } from '@/domain/learning'

const TONES = {
  new: 'neutral',
  weak: 'danger',
  activating: 'warning',
  strong: 'info',
  active: 'accent',
} as const

export function WordStatusChip({ status }: { status: WordStatus }) {
  return <Badge tone={TONES[status]}>{STATUS_LABELS[status]}</Badge>
}
