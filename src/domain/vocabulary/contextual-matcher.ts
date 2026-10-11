import type { VocabularyEntry } from './vocabulary.types';
import type { VocabularyIndex } from './vocabulary-index';

export type ContextSpan = {
  start: number;
  end: number;
  text: string;
  candidates: VocabularyEntry[];
};
const wordCharacter = (value: string | undefined) => !!value && /[\p{L}\p{N}\p{M}]/u.test(value);
/** Exact boundaries, longest phrase, original offsets; no implicit Korean morphology. */
export function matchContext(
  text: string,
  index: VocabularyIndex,
  lessonId?: number,
): ContextSpan[] {
  const matches: ContextSpan[] = [];
  for (let start = 0; start < text.length; start++) {
    if (wordCharacter(text[start - 1])) continue;
    let node = index.root;
    let longest: ContextSpan | null = null;
    for (let end = start; end < text.length; end++) {
      const child = node.children.get(text[end]!);
      if (!child) break;
      node = child;
      if (node.entries.length && !wordCharacter(text[end + 1]))
        longest = {
          start,
          end: end + 1,
          text: text.slice(start, end + 1),
          candidates: index.prefer(node.entries, lessonId),
        };
    }
    if (longest) {
      matches.push(longest);
      start = longest.end - 1;
    }
  }
  return matches;
}

export function unresolvedContextTokens(text: string, spans: ContextSpan[]): string[] {
  const tokens =
    typeof Intl.Segmenter === 'function'
      ? Array.from(new Intl.Segmenter('ko', { granularity: 'word' }).segment(text))
          .filter((part) => part.isWordLike)
          .map((part) => ({ text: part.segment, start: part.index }))
      : Array.from(text.matchAll(/[\p{L}\p{N}]+/gu)).map((part) => ({
          text: part[0],
          start: part.index,
        }));
  return tokens
    .filter(
      (token) =>
        /[가-힣]/u.test(token.text) &&
        !spans.some(
          (span) => span.start <= token.start && span.end >= token.start + token.text.length,
        ),
    )
    .map((token) => token.text);
}
