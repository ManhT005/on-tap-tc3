import { describe, expect, it } from 'vitest';
import { createPracticeSession } from './practice-session';
import { scorePractice, type ScorableQuestion } from './score-practice';

const questions: ScorableQuestion[] = [
  { id: 'q1', correctIndex: 0 },
  { id: 'q2', correctIndex: 1 },
  { id: 'q3', correctIndex: 2 },
];

function createSession(answers: Record<string, unknown>, questionIds = ['q1', 'q2', 'q3']) {
  return {
    ...createPracticeSession({
      id: 'session-1',
      lessonId: 1,
      mode: 'lesson' as const,
      questionIds,
      startedAt: '2026-10-01T08:00:00.000Z',
    }),
    answers,
  };
}

const options = { resultId: 'result-1', completedAt: '2026-10-01T08:10:00.000Z' };

describe('scorePractice', () => {
  it('returns a zero score for an empty session', () => {
    const result = scorePractice(createSession({}, []), [], options);

    expect(result).toMatchObject({
      score: 0,
      correct: 0,
      wrong: 0,
      total: 0,
      wrongQuestionIds: [],
    });
  });

  it('scores an all-correct session', () => {
    const result = scorePractice(createSession({ q1: 0, q2: 1, q3: 2 }), questions, options);

    expect(result).toMatchObject({ score: 100, correct: 3, wrong: 0, wrongQuestionIds: [] });
  });

  it('scores an all-wrong session and preserves all wrong IDs', () => {
    const result = scorePractice(createSession({ q1: 1, q2: 0, q3: 0 }), questions, options);

    expect(result).toMatchObject({
      score: 0,
      correct: 0,
      wrong: 3,
      wrongQuestionIds: ['q1', 'q2', 'q3'],
    });
  });

  it('scores mixed answers as a rounded percentage', () => {
    const result = scorePractice(createSession({ q1: 0, q2: 0 }), questions, options);

    expect(result).toMatchObject({
      score: 33,
      correct: 1,
      wrong: 2,
      wrongQuestionIds: ['q2', 'q3'],
    });
  });

  it.each([undefined, -1, '1', 4])('treats invalid answer %s as incorrect', (answer) => {
    const result = scorePractice(createSession({ q1: answer }), questions, options);

    expect(result).toMatchObject({ correct: 0, wrong: 3, wrongQuestionIds: ['q1', 'q2', 'q3'] });
  });

  it('rejects a selected question missing from the supplied bank', () => {
    expect(() => scorePractice(createSession({}, ['missing']), [], options)).toThrow(
      'Practice session references missing question "missing".',
    );
  });
});
