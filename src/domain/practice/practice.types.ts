export type PracticeMode = 'lesson' | 'quiz' | 'reading' | 'writing';

/** AUTO_GRADED: scored objectively (quiz/reading correctIndex comparison).
 *  SELF_ASSESSED: user self-reports pass/fail (writing); excluded from objective accuracy. */
export type AssessmentType = 'AUTO_GRADED' | 'SELF_ASSESSED';

export type PracticeSession = {
  id: string;
  lessonId?: number;
  mode: PracticeMode;
  questionIds: string[];
  answers: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
};

export type PracticeResult = {
  id: string;
  lessonId?: number;
  mode: PracticeMode;
  /** BUG-P2-007: Distinguishes objectively-graded from self-assessed results.
   *  Defaults to AUTO_GRADED when absent (for backward compatibility with stored data). */
  assessmentType?: AssessmentType;
  score: number;
  correct: number;
  wrong: number;
  total: number;
  wrongQuestionIds: string[];
  answers: Record<string, unknown>;
  startedAt: string;
  completedAt: string;
};
