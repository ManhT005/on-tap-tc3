import type { ReviewStatus } from '../../data/schemas';
import { LESSONS_DATA } from '../../data/lessons';
import { QUIZ_BANK } from '../../data/quiz-bank';
import { READING_BANK } from '../../data/reading-bank';

export type ReviewPrompt = {
  prompt: string;
  answer: string;
  example?: string;
};

export function getReviewPrompt(item: ReviewStatus): ReviewPrompt | null {
  if (item.itemType === 'question') {
    const question = QUIZ_BANK.find((candidate) => String(candidate.id) === item.itemId);
    if (question) {
      return {
        prompt: question.question,
        answer: `${question.options[question.correctIndex]}\n${question.explanation}`,
      };
    }

    for (const passages of Object.values(READING_BANK)) {
      for (const passage of passages) {
        const readingQuestion = passage.questions.find((candidate) => candidate.id === item.itemId);
        if (readingQuestion) {
          return {
            prompt: readingQuestion.question,
            answer: `${readingQuestion.options[readingQuestion.correctIndex]}\n${readingQuestion.evidence ?? ''}`,
          };
        }
      }
    }

    return null;
  }

  if (item.itemType === 'vocabulary') {
    const stableVocabMatch = item.itemId.match(/^lesson-(\d+)-vocab-(.+)$/);
    if (stableVocabMatch) {
      const [, lessonIdStr, encodedWord] = stableVocabMatch;
      if (lessonIdStr && encodedWord) {
        const lesson = LESSONS_DATA[Number(lessonIdStr)];
        if (lesson) {
          let decodedWord = encodedWord;
          try {
            decodedWord = decodeURIComponent(encodedWord);
          } catch {
            // ignore malformed URI component and use raw
          }
          for (const pack of lesson.vocabulary) {
            const found = pack.items.find((vocab) => vocab.kr === decodedWord);
            if (found) {
              return {
                prompt: found.kr,
                answer: found.vn,
                example: found.note,
              };
            }
          }
        }
      }
    }

    const vocabularyMatch = item.itemId.match(/^lesson-(\d+)-vocabulary-(\d+)-(\d+)$/);
    if (vocabularyMatch) {
      const [, lessonId, packIndex, itemIndex] = vocabularyMatch;
      const vocabulary =
        LESSONS_DATA[Number(lessonId)]?.vocabulary[Number(packIndex)]?.items[Number(itemIndex)];
      if (!vocabulary) return null;

      return {
        prompt: vocabulary.kr,
        answer: vocabulary.vn,
        example: vocabulary.note,
      };
    }
  }

  if (item.itemType === 'grammar') {
    const stableGrammarMatch = item.itemId.match(/^lesson-(\d+)-grammar-(.+)$/);
    if (stableGrammarMatch) {
      const [, lessonIdStr, identifier] = stableGrammarMatch;
      if (lessonIdStr && identifier) {
        const lesson = LESSONS_DATA[Number(lessonIdStr)];
        if (lesson) {
          // First check if identifier is a numeric index
          if (/^\d+$/.test(identifier)) {
            const grammar = lesson.grammar[Number(identifier)];
            if (grammar) {
              return {
                prompt: grammar.structure,
                answer: `${grammar.meaning}\n${grammar.rule}`,
                example: grammar.examples[0]?.kr,
              };
            }
          }
          // Otherwise search by structure text
          let decoded = identifier;
          try {
            decoded = decodeURIComponent(identifier);
          } catch {
            // ignore
          }
          const grammar = lesson.grammar.find((g) => g.structure === decoded);
          if (grammar) {
            return {
              prompt: grammar.structure,
              answer: `${grammar.meaning}\n${grammar.rule}`,
              example: grammar.examples[0]?.kr,
            };
          }
        }
      }
    }
  }

  return null;
}
