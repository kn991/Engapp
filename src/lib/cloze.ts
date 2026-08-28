/** Blanks the target word inside an example so it can be used as a gap-fill. */
export function buildCloze(sentence: string, lemma: string): string | null {
  const escaped = lemma.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`\\b${escaped}\\b`, 'i')
  if (!pattern.test(sentence)) return null
  return sentence.replace(pattern, '___')
}
