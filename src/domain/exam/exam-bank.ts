import { QUIZ_BANK } from '../../data/quiz-bank';
import { READING_BANK } from '../../data/reading-bank';
import { LISTENING_BANK } from '../../data/listening-bank';
import type { ExamQuestion } from './exam.types';

export function getExamBank(): ExamQuestion[] {
  return [
    ...QUIZ_BANK.map((question) => ({
      id: String(question.id),
      lessonId: question.lessonId,
      section: 'quiz' as const,
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    })),
    ...Object.entries(READING_BANK).flatMap(([lessonId, passages]) =>
      passages.flatMap((passage) =>
        passage.questions.map((question) => ({
          ...question,
          lessonId: Number(lessonId),
          section: 'reading' as const,
          explanation: question.evidence,
          context: passage.koreanText,
        })),
      ),
    ),
    ...LISTENING_BANK.flatMap((passage) =>
      passage.questions.map((question) => ({
        ...question,
        lessonId: passage.lessonId,
        section: 'listening' as const,
        explanation: question.evidence,
        listening: passage,
      })),
    ),
  ];
}
