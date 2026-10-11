import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { IndexedDbProgressRepository } from './indexeddb/indexeddb-progress.repository';
import { MemoryProgressRepository } from './memory-progress.repository';
import { completePracticeSession } from '../domain/practice/complete-practice';
import type { ReviewCommand } from '../domain/review/review-command';

function event(eventId: string): ReviewCommand {
  return {
    eventId,
    itemId: '1',
    itemType: 'question',
    correct: false,
    confidence: 1,
    gradedAt: '2026-10-11T00:00:00.000Z',
  };
}

describe.each(['memory', 'indexeddb'] as const)('atomic RMW: %s', (adapter) => {
  function repositories() {
    const databaseName = crypto.randomUUID();
    const a =
      adapter === 'memory'
        ? new MemoryProgressRepository()
        : new IndexedDbProgressRepository({ databaseName });
    const b = adapter === 'memory' ? a : new IndexedDbProgressRepository({ databaseName });
    return [a, b] as const;
  }
  async function close(repos: ReturnType<typeof repositories>) {
    for (const repo of repos) if (repo instanceof IndexedDbProgressRepository) await repo.close();
  }

  it('applies all distinct events across two instances, deduplicates replays', async () => {
    const repos = repositories();
    await Promise.all(
      Array.from({ length: 20 }, (_, i) => repos[i % 2]!.applyReview(event(`e${i}`))),
    );
    await Promise.all(repos.map((repo) => repo.applyReview(event('e0'))));
    expect(await repos[0].getReviewItems()).toEqual([
      expect.objectContaining({ repetitions: 20, wrongCount: 20, correctCount: 0 }),
    ]);
    await close(repos);
  });

  it('serializes practice completions against review grades without losing counters', async () => {
    const repos = repositories();
    await Promise.all(
      Array.from({ length: 12 }, (_, i) =>
        completePracticeSession(
          {
            id: `session-${i}`,
            mode: 'quiz',
            questionIds: ['1'],
            answers: { '1': 1 },
            startedAt: '2026-10-11T00:00:00.000Z',
          },
          [{ id: '1', correctIndex: 0 }],
          repos[i % 2]!,
          {
            resultId: `result-${i}`,
            completedAt: '2026-10-11T00:01:00.000Z',
          },
        ),
      ),
    );
    await Promise.all([
      repos[0].applyReview(event('grade')),
      completePracticeSession(
        {
          id: 'last',
          mode: 'quiz',
          questionIds: ['1'],
          answers: { '1': 1 },
          startedAt: '2026-10-11T00:00:00.000Z',
        },
        [{ id: '1', correctIndex: 0 }],
        repos[1],
        {
          resultId: 'last',
          completedAt: '2026-10-11T00:01:00.000Z',
        },
      ),
    ]);
    expect((await repos[0].getReviewItems())[0]).toMatchObject({ repetitions: 14, wrongCount: 14 });
    expect((await repos[0].getCourseProgress()).practiceSessions).toBe(13);
    await close(repos);
  });

  it('rolls back result, receipt and earlier review writes on a later mutation failure', async () => {
    const repos = repositories();
    const command = {
      sessionId: 'broken',
      result: {
        id: 'broken',
        mode: 'quiz' as const,
        score: 0,
        correct: 0,
        wrong: 2,
        total: 2,
        wrongQuestionIds: ['1', '2'],
        answers: {},
        startedAt: '2026-10-11T00:00:00.000Z',
        completedAt: '2026-10-11T00:01:00.000Z',
      },
      reviewCommands: [event('first'), { ...event('second'), itemId: '2', gradedAt: 'invalid' }],
    };
    await expect(repos[0].commitPracticeCompletion(command)).rejects.toThrow(
      'Invalid review event',
    );
    expect((await repos[1].getCourseProgress()).practiceSessions).toBe(0);
    expect(await repos[1].getReviewItems()).toEqual([]);
    // Retry has no orphan receipt left behind by the failed transaction.
    await repos[1].commitPracticeCompletion({ ...command, reviewCommands: [event('first')] });
    expect((await repos[0].getCourseProgress()).practiceSessions).toBe(1);
    expect((await repos[0].getReviewItems())[0]?.wrongCount).toBe(1);
    await close(repos);
  });
});
