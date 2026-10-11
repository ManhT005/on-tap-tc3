import type { ReviewStatus } from '../data/schemas';
import {
  VocabularySessionSchema,
  mutateVocabularySession,
  type VocabularySession,
  type VocabularyMutation,
} from '../domain/vocabulary/vocabulary-session';
import { applyReviewCommand, type ReviewCommand } from '../domain/review/review-command';
import { applyLessonEvent, type LessonEvent } from '../domain/progress/lesson-progress';
import {
  normalizeSnapshot,
  snapshotFingerprint,
  WritingDraftSchema,
  type ProgressSnapshot,
  type WritingDraft,
} from '../domain/progress/backup';
import type { AppSetting } from '../domain/progress/progress.types';
import { ExamAttemptSchema, type ExamAttempt, type ExamMutation } from '../domain/exam/exam.types';
import { startExam, mutateExam, completeExam } from '../domain/exam/exam-engine';
import type { PracticeResult } from '../domain/practice/practice.types';
import type { CourseProgress, LessonProgress } from '../domain/progress/progress.types';
import type { PracticeCompletionCommand, ProgressRepository } from './progress.repository';

export class MemoryProgressRepository implements ProgressRepository {
  private readonly lessons = new Map<number, LessonProgress>();
  private readonly reviewItems = new Map<string, ReviewStatus>();
  private readonly practiceResults = new Map<string, PracticeResult>();
  private readonly receipts = new Map<string, string>();
  private readonly reviewReceipts = new Map<string, ReviewStatus>();
  private readonly settings = new Map<string, AppSetting>();
  private readonly now: () => Date;

  constructor(now: () => Date = () => new Date()) {
    this.now = now;
  }

  async getCourseProgress(): Promise<CourseProgress> {
    const lessons = [...this.lessons.values()];
    const reviewItems = [...this.reviewItems.values()];
    const results = [...this.practiceResults.values()];
    // BUG-P2-007: Exclude SELF_ASSESSED writing results from objective accuracy.
    const gradedResults = results.filter(
      (r) =>
        (r.assessmentType ?? (r.mode === 'writing' ? 'SELF_ASSESSED' : 'AUTO_GRADED')) ===
        'AUTO_GRADED',
    );
    const correctAnswers = gradedResults.reduce((total, result) => total + result.correct, 0);
    const totalAnswers = gradedResults.reduce((total, result) => total + result.total, 0);
    const now = this.now().toISOString();

    return {
      lessonsCompleted: lessons.filter((lesson) => lesson.status === 'COMPLETED').length,
      lessonsInProgress: lessons.filter((lesson) => lesson.status === 'IN_PROGRESS').length,
      practiceSessions: results.length,
      correctAnswers,
      totalAnswers,
      accuracy: totalAnswers === 0 ? 0 : Math.round((correctAnswers / totalAnswers) * 100),
      reviewsDue: reviewItems.filter((item) => item.nextReviewAt <= now).length,
      vocabularyReviewed: reviewItems.filter(
        (item) => item.itemType === 'vocabulary' && item.repetitions > 0,
      ).length,
      grammarReviewed: reviewItems.filter(
        (item) => item.itemType === 'grammar' && item.repetitions > 0,
      ).length,
    };
  }

  async getVocabularySession(lessonId: number): Promise<VocabularySession | null> {
    const setting = this.settings.get(`vocabulary-session:${lessonId}`);
    return setting ? VocabularySessionSchema.parse(structuredClone(setting.value)) : null;
  }
  async startVocabularySession(
    input: VocabularySession,
    expectedSessionId?: string,
  ): Promise<VocabularySession> {
    const session = VocabularySessionSchema.parse(input);
    if (Object.keys(session.grades).length || session.cursor !== 0)
      throw new Error('New session must be ungraded.');
    const stored = this.settings.get(`vocabulary-session:${session.lessonId}`);
    const previous = stored ? VocabularySessionSchema.parse(stored.value) : null;
    if (previous && expectedSessionId === undefined) return previous;
    if (expectedSessionId !== undefined && previous?.id !== expectedSessionId)
      throw new Error('Vocabulary session changed in another tab.');
    this.settings.set(`vocabulary-session:${session.lessonId}`, {
      key: `vocabulary-session:${session.lessonId}`,
      value: structuredClone(session),
      updatedAt: session.updatedAt,
    });
    return session;
  }
  async mutateVocabularySession(mutation: VocabularyMutation): Promise<VocabularySession> {
    const key = `vocabulary-session:${mutation.lessonId}`;
    const stored = this.settings.get(key);
    if (!stored) throw new Error('Vocabulary session not found.');
    const { session, command } = mutateVocabularySession(
      VocabularySessionSchema.parse(stored.value),
      mutation,
    );
    if (command && !this.reviewReceipts.has(command.eventId)) {
      const reviewKey = `vocabulary:${command.itemId}`;
      const review = applyReviewCommand(this.reviewItems.get(reviewKey), command)!;
      const progress = applyLessonEvent(this.lessons.get(session.lessonId), command.lessonEvent!);
      this.reviewItems.set(reviewKey, structuredClone(review));
      this.reviewReceipts.set(command.eventId, structuredClone(review));
      this.lessons.set(session.lessonId, structuredClone(progress));
    }
    this.settings.set(key, { key, value: structuredClone(session), updatedAt: session.updatedAt });
    return session;
  }

  async getLessonProgress(lessonId: number): Promise<LessonProgress | null> {
    return structuredClone(this.lessons.get(lessonId) ?? null);
  }

  async saveLessonProgress(progress: LessonProgress): Promise<void> {
    this.lessons.set(progress.lessonId, structuredClone(progress));
  }

  async applyLessonEvent(event: LessonEvent): Promise<LessonProgress> {
    const progress = applyLessonEvent(this.lessons.get(event.lessonId), event);
    this.lessons.set(event.lessonId, structuredClone(progress));
    return structuredClone(progress);
  }

  async getReviewItems(): Promise<ReviewStatus[]> {
    return structuredClone([...this.reviewItems.values()]);
  }

  async saveReviewItem(item: ReviewStatus): Promise<void> {
    this.reviewItems.set(`${item.itemType}:${item.itemId}`, structuredClone(item));
  }

  async savePracticeResult(result: PracticeResult): Promise<void> {
    if (
      result.sessionId &&
      [...this.practiceResults.values()].some(
        (item) => item.id !== result.id && item.sessionId === result.sessionId,
      )
    )
      throw new DOMException('Session already stored', 'ConstraintError');
    this.practiceResults.set(result.id, structuredClone(result));
  }

  async getPracticeResults(): Promise<PracticeResult[]> {
    return structuredClone(
      [...this.practiceResults.values()].sort((a, b) => b.completedAt.localeCompare(a.completedAt)),
    );
  }

  async getActiveExamAttempt(): Promise<ExamAttempt | null> {
    const active = this.settings.get('active-exam');
    const stored =
      typeof active?.value === 'string'
        ? this.settings.get(`exam-attempt:${active.value}`)
        : undefined;
    return stored ? ExamAttemptSchema.parse(structuredClone(stored.value)) : null;
  }
  async createExamAttempt(input: ExamAttempt): Promise<ExamAttempt> {
    const parsed = ExamAttemptSchema.parse(input);
    if (parsed.status !== 'CREATED') throw new Error('New exam must be CREATED.');
    const active = this.settings.get('active-exam');
    const current =
      typeof active?.value === 'string'
        ? this.settings.get(`exam-attempt:${active.value}`)
        : undefined;
    if (current) {
      const attempt = ExamAttemptSchema.parse(current.value);
      if (attempt.status === 'IN_PROGRESS') return structuredClone(attempt);
    }
    const existing = this.settings.get(`exam-attempt:${parsed.id}`);
    if (existing) return ExamAttemptSchema.parse(structuredClone(existing.value));
    const now = this.now();
    const attempt = startExam(parsed, now);
    this.settings.set(`exam-attempt:${attempt.id}`, {
      key: `exam-attempt:${attempt.id}`,
      value: structuredClone(attempt),
      updatedAt: now.toISOString(),
    });
    this.settings.set('active-exam', {
      key: 'active-exam',
      value: attempt.id,
      updatedAt: now.toISOString(),
    });
    return structuredClone(attempt);
  }
  async mutateExamAttempt(mutation: ExamMutation): Promise<ExamAttempt> {
    const key = `exam-attempt:${mutation.attemptId}`;
    const stored = this.settings.get(key);
    if (!stored) throw new Error('Exam not found.');
    const now = this.now();
    const attempt = mutateExam(ExamAttemptSchema.parse(stored.value), mutation, now);
    this.settings.set(key, { key, value: structuredClone(attempt), updatedAt: now.toISOString() });
    return structuredClone(attempt);
  }
  async submitExamAttempt(
    attemptId: string,
  ): Promise<{ attempt: ExamAttempt; result: PracticeResult }> {
    const key = `exam-attempt:${attemptId}`;
    const stored = this.settings.get(key);
    if (!stored) throw new Error('Exam not found.');
    const attempt = ExamAttemptSchema.parse(structuredClone(stored.value));
    if (attempt.status === 'SUBMITTED' || attempt.status === 'EXPIRED') {
      const result = this.practiceResults.get(attempt.resultId!);
      if (!result) throw new Error('Exam result is missing.');
      return { attempt, result: structuredClone(result) };
    }
    const completed = completeExam(attempt, this.now());
    const reviews = new Map(this.reviewItems);
    for (const event of completed.reviewCommands) {
      const reviewKey = `${event.itemType}:${event.itemId}`;
      const updated = applyReviewCommand(reviews.get(reviewKey), event);
      if (updated) reviews.set(reviewKey, updated);
    }
    this.practiceResults.set(completed.result.id, structuredClone(completed.result));
    this.receipts.set(attemptId, completed.result.id);
    for (const [reviewKey, value] of reviews)
      this.reviewItems.set(reviewKey, structuredClone(value));
    this.settings.set(key, {
      key,
      value: structuredClone(completed.attempt),
      updatedAt: completed.result.completedAt,
    });
    return {
      attempt: structuredClone(completed.attempt),
      result: structuredClone(completed.result),
    };
  }
  async getWritingDraft(lessonId: number, promptId: string): Promise<WritingDraft | null> {
    const setting = this.settings.get(`writing-draft:${lessonId}:${promptId}`);
    return setting ? WritingDraftSchema.parse(structuredClone(setting.value)) : null;
  }
  async saveWritingDraft(draft: WritingDraft): Promise<void> {
    WritingDraftSchema.parse(draft);
    const key = `writing-draft:${draft.lessonId}:${draft.promptId}`;
    const current = this.settings.get(key);
    if (!current || current.updatedAt <= draft.updatedAt)
      this.settings.set(key, { key, value: structuredClone(draft), updatedAt: draft.updatedAt });
  }
  async getSnapshot(): Promise<ProgressSnapshot> {
    return this.snapshot();
  }
  private snapshot(): ProgressSnapshot {
    const settings = new Map(this.settings);
    for (const [eventId, item] of this.reviewReceipts) {
      const key = `review-event:${eventId}`;
      settings.set(key, { key, value: item, updatedAt: item.lastReviewedAt });
    }
    return structuredClone({
      lessons: [...this.lessons.values()],
      reviewItems: [...this.reviewItems.values()],
      results: [...this.practiceResults.values()],
      receipts: [...this.receipts].map(([sessionId, resultId]) => ({
        sessionId,
        resultId,
        completedAt: this.practiceResults.get(resultId)!.completedAt,
      })),
      settings: [...settings.values()],
    });
  }
  async restoreSnapshot(
    input: ProgressSnapshot,
    expectedCurrent?: ProgressSnapshot,
  ): Promise<void> {
    const snapshot = structuredClone(normalizeSnapshot(input));
    if (
      expectedCurrent &&
      snapshotFingerprint(this.snapshot()) !== snapshotFingerprint(expectedCurrent)
    )
      throw new Error('Data changed since backup; export again before replacing.');
    this.lessons.clear();
    this.reviewItems.clear();
    this.practiceResults.clear();
    this.receipts.clear();
    this.settings.clear();
    this.reviewReceipts.clear();
    for (const item of snapshot.lessons) this.lessons.set(item.lessonId, item);
    for (const item of snapshot.reviewItems)
      this.reviewItems.set(`${item.itemType}:${item.itemId}`, item);
    for (const item of snapshot.results) this.practiceResults.set(item.id, item);
    for (const item of snapshot.receipts) this.receipts.set(item.sessionId, item.resultId);
    for (const item of snapshot.settings) {
      this.settings.set(item.key, item);
      if (item.key.startsWith('review-event:'))
        this.reviewReceipts.set(item.key.slice('review-event:'.length), item.value as ReviewStatus);
    }
  }

  async applyReview(command: ReviewCommand): Promise<ReviewStatus> {
    const receipt = this.reviewReceipts.get(command.eventId);
    if (receipt) return structuredClone(receipt);
    const key = `${command.itemType}:${command.itemId}`;
    const updated = applyReviewCommand(this.reviewItems.get(key), command);
    if (!updated) throw new Error('Review item is not tracked.');
    const progress = command.lessonEvent
      ? applyLessonEvent(this.lessons.get(command.lessonEvent.lessonId), command.lessonEvent)
      : undefined;
    this.reviewItems.set(key, structuredClone(updated));
    this.reviewReceipts.set(command.eventId, structuredClone(updated));
    if (progress) this.lessons.set(progress.lessonId, structuredClone(progress));
    return structuredClone(updated);
  }

  async commitPracticeCompletion(command: PracticeCompletionCommand): Promise<PracticeResult> {
    // Idempotency: if a result with this ID already exists, skip entirely.
    const existing =
      this.practiceResults.get(this.receipts.get(command.sessionId) ?? command.result.id) ??
      [...this.practiceResults.values()].find((result) => result.sessionId === command.sessionId);
    if (existing) {
      if (existing.sessionId && existing.sessionId !== command.sessionId)
        throw new DOMException('Result ID belongs to another session.', 'ConstraintError');
      return structuredClone(existing);
    }

    const result = structuredClone({ ...command.result, sessionId: command.sessionId });
    const progress = command.lessonEvent
      ? applyLessonEvent(this.lessons.get(command.lessonEvent.lessonId), command.lessonEvent)
      : undefined;
    const updates = new Map(this.reviewItems);
    for (const event of command.reviewCommands) {
      const key = `${event.itemType}:${event.itemId}`;
      const updated = applyReviewCommand(updates.get(key), event);
      if (updated) updates.set(key, updated);
    }
    this.practiceResults.set(result.id, result);
    this.receipts.set(command.sessionId, result.id);

    for (const [key, item] of updates) this.reviewItems.set(key, structuredClone(item));

    if (progress) this.lessons.set(progress.lessonId, structuredClone(progress));
    return structuredClone(result);
  }
}
