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
