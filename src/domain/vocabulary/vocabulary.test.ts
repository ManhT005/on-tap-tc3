import { describe, expect, it } from 'vitest';
import { adaptVocabulary } from './vocabulary.adapter';
import { planVocabularyBatch } from './session-planner';
import { createReviewStatus } from '../review/review-engine';
import { mutateVocabularySession, type VocabularySession } from './vocabulary-session';

export function sessionFixture(): VocabularySession {
  return {
    id: 'batch-test',
    lessonId: 1,
    itemIds: ['vocab-01-0001', 'vocab-01-0002'],
    batchSize: 5,
    cursor: 0,
    grades: {},
    startedAt: '2026-10-11T00:00:00.000Z',
    updatedAt: '2026-10-11T00:00:00.000Z',
  };
}
describe('vocabulary read model and batch contract', () => {
  it('retains all 1085 immutable identities and never treats notes as approved examples', () => {
    const entries = adaptVocabulary();
    expect(entries).toHaveLength(1085);
    expect(new Set(entries.map((item) => item.id)).size).toBe(1085);
    expect(entries[0]).toMatchObject({ id: 'vocab-01-0001', korean: '학기', source: 'basic' });
    expect(entries[0]?.examples).toBeUndefined();
    expect(entries[0]?.collocations.length).toBeGreaterThan(0);
  });
  it('prioritizes weak then unseen words deterministically and honors excluded IDs', () => {
    const entries = adaptVocabulary().filter((item) => item.lessonId === 1);
    const weak = {
      ...createReviewStatus('vocab-01-0003', 'vocabulary', new Date()),
      confidence: 1 as const,
    };
    expect(planVocabularyBatch(entries.reverse(), 5, ['vocab-01-0001'], [weak])).toEqual([
      'vocab-01-0003',
      'vocab-01-0002',
      'vocab-01-0004',
      'vocab-01-0005',
      'vocab-01-0006',
    ]);
    expect(planVocabularyBatch(entries, 5, [], [], ['vocab-01-0001'])).not.toContain(
      'vocab-01-0001',
    );
  });
  it('viewing does not grade and repeating a grade returns the original assessment', () => {
    const move = mutateVocabularySession(sessionFixture(), {
      sessionId: 'batch-test',
      lessonId: 1,
      kind: 'move',
      cursor: 1,
      occurredAt: '2026-10-11T01:00:00.000Z',
    });
    expect(move.command).toBeUndefined();
    const grade = {
      sessionId: 'batch-test',
      lessonId: 1,
      kind: 'grade' as const,
      itemId: 'vocab-01-0001',
      confidence: 4 as const,
      occurredAt: '2026-10-11T01:00:00.000Z',
    };
    const first = mutateVocabularySession(move.session, grade);
    expect(first.command?.lessonEvent?.kind).toBe('recall');
    expect(
      mutateVocabularySession(first.session, { ...grade, confidence: 1 }).session.grades[
        'vocab-01-0001'
      ],
    ).toBe(4);
    expect(() => mutateVocabularySession(first.session, { ...grade, sessionId: 'stale' })).toThrow(
      'another tab',
    );
  });
});
