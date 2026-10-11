import { writeFileSync, readFileSync } from 'node:fs';
import { adaptVocabulary } from '../src/domain/vocabulary/vocabulary.adapter';
import { validateVocabulary } from '../src/domain/vocabulary/validate-vocabulary';
import { VOCABULARY_ENRICHMENT } from '../src/data/vocabulary-enrichment';
import { READING_BANK } from '../src/data/reading-bank';
import { LISTENING_BANK } from '../src/data/listening-bank';
import { createVocabularyIndex } from '../src/domain/vocabulary/vocabulary-index';
import { matchContext, unresolvedContextTokens } from '../src/domain/vocabulary/contextual-matcher';

const entries = adaptVocabulary(VOCABULARY_ENRICHMENT);
const errors = validateVocabulary(entries, VOCABULARY_ENRICHMENT);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const enriched = entries.filter((entry) => entry.examples?.length).length;
const approved = entries.filter(
  (entry) =>
    entry.reviewStatus === 'approved' &&
    entry.examples?.some((example) => example.reviewStatus === 'approved'),
).length;
const index = createVocabularyIndex(entries);
const passages = [
  ...Object.values(READING_BANK).flatMap((items) => items.map((item) => item.koreanText)),
  ...LISTENING_BANK.map((item) => item.transcript),
];
const unresolved = passages.flatMap((text) =>
  unresolvedContextTokens(text, matchContext(text, index)),
);
const rows = Array.from({ length: 15 }, (_, index) => {
  const lesson = entries.filter((entry) => entry.lessonId === index + 1);
  return `| ${index + 1} | ${lesson.length} | ${lesson.filter((entry) => entry.examples?.length).length} | ${lesson.filter((entry) => entry.reviewStatus === 'approved' && entry.examples?.some((example) => example.reviewStatus === 'approved')).length} | 0 |`;
});
const report = `# Vocabulary enrichment coverage\n\nGenerated from immutable course entries; draft coverage is not language/source sign-off.\n\n- Entries: ${entries.length}\n- Editorial draft enrichment: ${enriched}/${entries.length}\n- Approved sentence enrichment: ${approved}/${entries.length}\n- Approved recorded word audio: 0/${entries.length}\n\n| Lesson | Entries | Enriched (including drafts) | Approved examples | Word audio |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}\n\nPending aliases are excluded from contextual matching. Korean particles and conjugations are not guessed. Unknown contextual tokens require manual local search; token coverage is measured separately from example approval.\n`;
const contextualReport = `${report}\n## Context matching audit\n\n- Reading + Listening passages: ${passages.length}\n- Unresolved Hangul token occurrences: ${unresolved.length}\n- Distinct unresolved tokens: ${new Set(unresolved).size}\n\nExamples of unresolved tokens (not guessed): ${[...new Set(unresolved)].slice(0, 12).join(', ')}.\n\nCounts use Intl.Segmenter word spans; segmentation is not lemmatization. Existing loanword MT (Membership Training), vocab-01-0029, is retained as a known legacy exception.\n`;
const path = 'docs/content/VOCAB_ENRICHMENT_COVERAGE.md';
if (process.argv.includes('--write-docs')) writeFileSync(path, contextualReport, 'utf8');
if (
  process.argv.includes('--check-docs') &&
  readFileSync(path, 'utf8').replace(/\r\n/g, '\n') !== contextualReport
) {
  console.error('Vocabulary coverage report is stale.');
  process.exit(1);
}
console.log(
  `Vocabulary valid: ${entries.length} entries, ${enriched} drafts, ${approved} approved examples, 0 recorded word assets.`,
);
