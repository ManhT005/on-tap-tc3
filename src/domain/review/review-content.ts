import type { ReviewStatus } from '../../data/schemas';
import { LESSONS_DATA } from '../../data/lessons';
import { QUIZ_BANK } from '../../data/quiz-bank';
import { READING_BANK } from '../../data/reading-bank';
import { resolveContentItemId } from './content-identity';

export type ReviewPrompt = { prompt: string; answer: string; example?: string };

export function getReviewPrompt(item: ReviewStatus): ReviewPrompt | null {
  if (item.itemType === 'question') {
    const question = QUIZ_BANK.find((candidate) => String(candidate.id) === item.itemId);
    if (question)
      return {
        prompt: question.question,
        answer: `${question.options[question.correctIndex]}\n${question.explanation}`,
      };
    for (const passage of Object.values(READING_BANK).flat()) {
      const question = passage.questions.find((candidate) => candidate.id === item.itemId);
      if (question)
        return {
          prompt: question.question,
          answer: `${question.options[question.correctIndex]}\n${question.evidence ?? ''}`,
        };
    }
    return null;
  }
  const id = resolveContentItemId(item.itemId);
  for (const lesson of Object.values(LESSONS_DATA)) {
    if (item.itemType === 'vocabulary') {
      const vocabulary = lesson.vocabulary
        .flatMap((pack) => pack.items)
        .find((candidate) => candidate.id === id);
      if (vocabulary)
        return { prompt: vocabulary.kr, answer: vocabulary.vn, example: vocabulary.note };
    } else {
      const grammar = lesson.grammar.find((candidate) => candidate.id === id);
      if (grammar)
        return {
          prompt: grammar.structure,
          answer: `${grammar.meaning}\n${grammar.rule}`,
          example: grammar.examples[0]?.kr,
        };
    }
  }
  return null;
}
