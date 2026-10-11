import type { VocabularyEnrichment, VocabularyEntry } from './vocabulary.types';

export function validateVocabulary(
  entries: VocabularyEntry[],
  enrichment: Record<string, VocabularyEnrichment>,
) {
  const errors: string[] = [];
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const aliases = new Map<string, string>();
  if (byId.size !== entries.length) errors.push('Duplicate vocabulary IDs');
  const clean = (value: string) =>
    value.trim() === value && value.normalize('NFC') === value && !/\s{2,}/u.test(value);
  for (const entry of entries) {
    if (
      !clean(entry.korean) ||
      !clean(entry.vietnamese) ||
      !entry.vietnamese.trim() ||
      (!/[가-힣]/u.test(entry.korean) &&
        !(entry.id === 'vocab-01-0029' && entry.korean === 'MT (Membership Training)'))
    )
      errors.push(`${entry.id}: invalid text/whitespace`);
  }
  for (const [id, value] of Object.entries(enrichment)) {
    const entry = byId.get(id);
    if (!entry) {
      errors.push(`${id}: orphan enrichment`);
      continue;
    }
    if (!value.sourceRef.trim() || !['pending', 'approved'].includes(value.reviewStatus))
      errors.push(`${id}: missing source/review status`);
    if (
      value.reviewStatus === 'approved' &&
      (!value.reviewer?.trim() ||
        !value.reviewedAt ||
        !Number.isFinite(new Date(value.reviewedAt).getTime()))
    )
      errors.push(`${id}: approval needs reviewer/date`);
    for (const example of value.examples) {
      if (
        !example.kr.trim() ||
        !example.vn.trim() ||
        !clean(example.kr) ||
        !clean(example.vn) ||
        !/[가-힣]/u.test(example.kr) ||
        !/[.!?。？！]$/u.test(example.kr)
      )
        errors.push(`${id}: example must be a complete Korean sentence with translation`);
      if (!['pending', 'approved'].includes(example.reviewStatus))
        errors.push(`${id}: example review status missing`);
      if (example.targetRange) {
        const [start, end] = example.targetRange;
        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 0 ||
          end <= start ||
          end > example.kr.length ||
          ![entry.korean, ...(value.lookupAliases ?? [])].includes(example.kr.slice(start, end))
        )
          errors.push(`${id}: invalid example target range`);
      }
    }
    for (const alias of value.lookupAliases ?? []) {
      if (!alias.trim() || !clean(alias) || !/[가-힣]/u.test(alias))
        errors.push(`${id}: invalid alias`);
      if (aliases.has(alias) && aliases.get(alias) !== id)
        errors.push(`${id}: conflicting alias ${alias}`);
      aliases.set(alias, id);
    }
  }
  return errors;
}
