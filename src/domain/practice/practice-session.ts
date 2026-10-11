import type { PracticeMode, PracticeSession } from './practice.types';

export type CreatePracticeSessionOptions = {
  id: string;
  lessonId?: number;
  mode: PracticeMode;
  questionIds: readonly (string | number)[];
  startedAt: string;
};

export function createPracticeSession({
  id,
  lessonId,
  mode,
  questionIds,
  startedAt,
}: CreatePracticeSessionOptions): PracticeSession {
  return {
    id,
    ...(lessonId === undefined ? {} : { lessonId }),
    mode,
    questionIds: questionIds.map(String),
    answers: {},
    startedAt,
  };
}
