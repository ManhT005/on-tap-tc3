export type LessonProgressState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVIEW';

export type LessonProgress = {
  lessonId: number;
  status: Exclude<LessonProgressState, 'NOT_STARTED'>;
  completionPercent?: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  steps?: LessonSteps;
  /** Historical completion recorded before event-based progress existed. */
  legacyCompletedAt?: string;
};

export type LessonSteps = {
  recallIds: string[];
  vocabularyIds: string[];
  grammarIds: string[];
  quickQuizCompleted: boolean;
};

export type CourseProgress = {
  lessonsCompleted: number;
  lessonsInProgress: number;
  practiceSessions: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  reviewsDue: number;
  vocabularyReviewed: number;
  grammarReviewed: number;
};

export type AppSetting = {
  key: string;
  value: unknown;
  updatedAt: string;
};
