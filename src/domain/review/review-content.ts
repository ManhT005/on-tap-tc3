import type { ReviewStatus } from '../../data/schemas';
import { LESSONS_DATA } from '../../data/lessons';
import { QUIZ_BANK } from '../../data/quiz-bank';

export type ReviewPrompt = {
  prompt: string;
  answer: string;
  example?: string;
};

export function getReviewPrompt(item: ReviewStatus): ReviewPrompt | null {
  if (item.itemType === 'question') {
    const question = QUIZ_BANK.find((candidate) => String(candidate.id) === item.itemId);
    if (!question) return null;

    return {
      prompt: question.question,
      answer: `${question.options[question.correctIndex]}\n${question.explanation}`,
    };
  }

  const vocabularyMatch = item.itemId.match(/^lesson-(\d+)-vocabulary-(\d+)-(\d+)$/);
  if (item.itemType === 'vocabulary' && vocabularyMatch) {
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

  const grammarMatch = item.itemId.match(/^lesson-(\d+)-grammar-(\d+)$/);
  if (item.itemType === 'grammar' && grammarMatch) {
    const [, lessonId, grammarIndex] = grammarMatch;
    const grammar = LESSONS_DATA[Number(lessonId)]?.grammar[Number(grammarIndex)];
    if (!grammar) return null;

    return {
      prompt: grammar.structure,
      answer: `${grammar.meaning}\n${grammar.rule}`,
      example: grammar.examples[0]?.kr,
    };
  }

  return null;
}
