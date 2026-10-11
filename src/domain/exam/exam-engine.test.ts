import { describe, expect, it } from 'vitest';
import {
  createExamAttempt,
  CORE_EXAM_BLUEPRINT,
  MIXED_EXAM_BLUEPRINT,
  startExam,
  mutateExam,
  completeExam,
} from './exam-engine';
import { getExamBank } from './exam-bank';

const now = new Date('2026-10-11T00:00:00.000Z');

describe('exam blueprint and deadline', () => {
  it('builds seeded unique section-balanced snapshots independent of bank order', () => {
    const bank = getExamBank();
    const first = createExamAttempt('exam', MIXED_EXAM_BLUEPRINT, bank, 'seed', now);
    const second = createExamAttempt(
      'exam',
      MIXED_EXAM_BLUEPRINT,
      [...bank].reverse(),
      'seed',
      now,
    );
    expect(first).toEqual(second);
    expect(new Set(first.questions.map((question) => question.id)).size).toBe(30);
    expect(first.questions.filter((question) => question.section === 'listening')).toHaveLength(5);
    expect(() => createExamAttempt('empty', CORE_EXAM_BLUEPRINT, [], 'seed', now)).toThrow(
      'Insufficient',
    );
  });

  it('keeps an immutable deadline and rejects answers at the exact expiry boundary', () => {
    const started = startExam(
      createExamAttempt('exam', CORE_EXAM_BLUEPRINT, getExamBank(), 'seed', now),
      now,
    );
    const deadline = new Date(started.deadlineAt!);
    expect(startExam(structuredClone(started), new Date(deadline.getTime() - 1))).toEqual(started);
    expect(() =>
      mutateExam(
        started,
        { attemptId: started.id, kind: 'answer', questionId: started.questions[0]!.id, answer: 0 },
        deadline,
      ),
    ).toThrow('deadline');
    const completed = completeExam(started, deadline);
    expect(completed.attempt.status).toBe('EXPIRED');
    expect(completed.result).toMatchObject({ total: 30, correct: 0, wrong: 30 });
  });
});
