import { describe, expect, it } from 'vitest';
import { createPracticeSession } from './practice-session';

describe('createPracticeSession', () => {
  it('creates an unanswered session with canonical string question IDs', () => {
    const session = createPracticeSession({
      id: 'session-1',
      lessonId: 1,
      mode: 'lesson',
      questionIds: [101, 'q-2'],
      startedAt: '2026-10-01T08:00:00.000Z',
    });

    expect(session).toEqual({
      id: 'session-1',
      lessonId: 1,
      mode: 'lesson',
      questionIds: ['101', 'q-2'],
      answers: {},
      startedAt: '2026-10-01T08:00:00.000Z',
    });
  });
});
