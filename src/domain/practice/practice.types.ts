export type PracticeMode = 'lesson' | 'quiz' | 'reading';

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
  score: number;
  correct: number;
  wrong: number;
  total: number;
  wrongQuestionIds: string[];
  answers: Record<string, unknown>;
  startedAt: string;
  completedAt: string;
};
