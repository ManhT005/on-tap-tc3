import { describe, expect, it } from 'vitest';
import { createPracticeSession } from './practice-session';
import { completePracticeSession } from './complete-practice';
import { MemoryProgressRepository } from '../../repositories/memory-progress.repository';

const questions = [
  { id: 1, correctIndex: 0 },
  { id: 2, correctIndex: 1 },
];

describe('completePracticeSession', () => {
  it('persists a result, completes the lesson, and queues missed questions', async () => {
    const repository = new MemoryProgressRepository(() => new Date('2026-10-01T08:10:00.000Z'));
    const session = {
      ...createPracticeSession({
        id: 'session-1',
        lessonId: 1,
        mode: 'lesson',
        questionIds: [1, 2],
        startedAt: '2026-10-01T08:00:00.000Z',
      }),
      answers: { '1': 0, '2': 0 },
    };

    const result = await completePracticeSession(session, questions, repository, {
      resultId: 'result-1',
      completedAt: '2026-10-01T08:10:00.000Z',
    });

    expect(result).toMatchObject({ score: 50, correct: 1, wrong: 1, wrongQuestionIds: ['2'] });
    await expect(repository.getLessonProgress(1)).resolves.toMatchObject({
      status: 'COMPLETED',
      completionPercent: 100,
    });
    await expect(repository.getReviewItems()).resolves.toEqual([
      expect.objectContaining({
        itemId: '2',
        itemType: 'question',
        wrongCount: 1,
        nextReviewAt: '2026-10-01T08:20:00.000Z',
      }),
    ]);
    await expect(repository.getCourseProgress()).resolves.toMatchObject({
      practiceSessions: 1,
      reviewsDue: 0,
    });
  });

  it('does not complete a lesson when a session has no questions', async () => {
    const repository = new MemoryProgressRepository();
    const session = createPracticeSession({
      id: 'empty-session',
      lessonId: 1,
      mode: 'lesson',
      questionIds: [],
      startedAt: '2026-10-01T08:00:00.000Z',
    });

    await completePracticeSession(session, [], repository, {
      resultId: 'empty-result',
      completedAt: '2026-10-01T08:10:00.000Z',
    });

    await expect(repository.getLessonProgress(1)).resolves.toBeNull();
  });

  it('does not complete the entire lesson for a standalone quiz session', async () => {
    const repository = new MemoryProgressRepository();
    const session = {
      ...createPracticeSession({
        id: 'quiz-session',
        lessonId: 1,
        mode: 'quiz',
        questionIds: [1, 2],
        startedAt: '2026-10-01T08:00:00.000Z',
      }),
      answers: { '1': 0, '2': 1 },
    };

    await completePracticeSession(session, questions, repository, {
      resultId: 'quiz-result',
      completedAt: '2026-10-01T08:10:00.000Z',
    });

    await expect(repository.getLessonProgress(1)).resolves.toBeNull();
  });
});
