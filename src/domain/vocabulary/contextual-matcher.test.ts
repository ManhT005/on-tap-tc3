import { describe, expect, it } from 'vitest';
import { createVocabularyIndex } from './vocabulary-index';
import { matchContext, unresolvedContextTokens } from './contextual-matcher';
import { adaptVocabulary } from './vocabulary.adapter';
import { validateVocabulary } from './validate-vocabulary';
import { VOCABULARY_ENRICHMENT } from '../../data/vocabulary-enrichment';

describe('context lookup safety', () => {
  const entries = adaptVocabulary(VOCABULARY_ENRICHMENT);
  const index = createVocabularyIndex(entries);
  it('matches longest exact phrases and preserves punctuation, spaces and offsets', () => {
    const text = '학기, 전공과목! 대인 관계가 좋다.\n학기';
    const spans = matchContext(text, index, 1);
    expect(spans.map((span) => span.text)).toEqual([
      '학기',
      '전공과목',
      '대인 관계가 좋다',
      '학기',
    ]);
    for (const span of spans) expect(text.slice(span.start, span.end)).toBe(span.text);
  });
  it('does not guess particles/conjugations or pending aliases', () => {
    const text = '학기에는 전공과목을 신청했어요. 건강해질';
    expect(matchContext(text, index, 1)).toHaveLength(0);
    expect(unresolvedContextTokens(text, [])).toContain('학기에는');
    expect(index.lookup('학기에는')).toEqual([]);
  });
  it('uses an explicitly approved alias and retains ambiguous senses with lesson preference', () => {
    const entry = entries[0]!;
    const fixture = createVocabularyIndex([
      { ...entry, reviewStatus: 'approved', lookupAliases: ['학기에는'] },
      { ...entry, id: 'fixture-sense', lessonId: 2, vietnamese: 'Nghĩa fixture khác' },
    ]);
    const result = matchContext('학기에는 학기', fixture, 2);
    expect(result[0]?.candidates[0]?.id).toBe(entry.id);
    expect(result[1]?.candidates).toHaveLength(2);
    expect(result[1]?.candidates[0]?.lessonId).toBe(2);
  });
  it('rejects orphan enrichment, bogus approvals, ranges and conflicting aliases', () => {
    expect(validateVocabulary(entries, VOCABULARY_ENRICHMENT)).toEqual([]);
    const bad = {
      ...VOCABULARY_ENRICHMENT,
      orphan: VOCABULARY_ENRICHMENT['vocab-01-0001']!,
      'vocab-01-0002': {
        ...VOCABULARY_ENRICHMENT['vocab-01-0001']!,
        reviewStatus: 'approved' as const,
      },
    };
    expect(validateVocabulary(entries, bad).join(' ')).toMatch(/orphan/);
    expect(validateVocabulary(entries, bad).join(' ')).toMatch(/approval/);
    expect(validateVocabulary(entries, bad).join(' ')).toMatch(/range/);
    expect(validateVocabulary(entries, bad).join(' ')).toMatch(/conflicting alias/);
  });
});
