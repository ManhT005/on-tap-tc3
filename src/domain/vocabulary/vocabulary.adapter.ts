import { LESSONS_DATA } from '../../data/lessons';
import type { VocabularyEnrichment, VocabularyEntry } from './vocabulary.types';

export function adaptVocabulary(
  enrichments: Record<string, VocabularyEnrichment> = {},
): VocabularyEntry[] {
  return Object.entries(LESSONS_DATA).flatMap(([lessonId, lesson]) =>
    lesson.vocabulary.flatMap((pack) =>
      pack.items.map((item) => {
        if (!item.id) throw new Error('Vocabulary requires an immutable ID.');
        return {
          ...enrichments[item.id],
          id: item.id,
          lessonId: Number(lessonId),
          korean: item.kr.normalize('NFC').trim().replace(/\s+/g, ' '),
          vietnamese: item.vn.normalize('NFC').trim().replace(/\s+/g, ' '),
          source: pack.sourceTag.includes('기본')
            ? ('basic' as const)
            : pack.sourceTag.includes('새')
              ? ('new-word' as const)
              : pack.sourceTag.includes('듣기')
                ? ('listening' as const)
                : ('supplemental' as const),
          category: pack.category,
          collocations: item.note ? [item.note] : [],
        };
      }),
    ),
  );
}
