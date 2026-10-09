import { describe, expect, it } from 'vitest';
import { selectPracticeQuestions, shuffleArray } from './QuizPractice';

describe('shuffleArray (BUG-P2-005)', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('returns the same elements in a (potentially) different order', () => {
    const result = shuffleArray(items);
    expect(result).toHaveLength(items.length);
    expect(result.sort((a, b) => a - b)).toEqual(items);
  });

  it('is deterministic given a fixed rng sequence', () => {
    // Seeded RNG: always returns 0 → elements shift to the front predictably
    const rng = () => 0;
    const first = shuffleArray(items, rng);
    const second = shuffleArray(items, rng);
    expect(first).toEqual(second);
  });

  it('produces different orders for different rng sequences', () => {
    let callCount = 0;
    const rng1 = () => (callCount++ % 2 === 0 ? 0 : 0.99);
    const rng2 = () => 0.5;
    expect(shuffleArray(items, rng1)).not.toEqual(shuffleArray(items, rng2));
  });

  it('handles an empty array without error', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe('selectPracticeQuestions (BUG-P2-005)', () => {
  const bank = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));

  it('returns at most `count` items', () => {
    const result = selectPracticeQuestions(bank, 10);
    expect(result).toHaveLength(10);
  });

  it('returns all items when count >= bank size', () => {
    const result = selectPracticeQuestions(bank, 100);
    expect(result).toHaveLength(bank.length);
  });

  it('returns no duplicates within a session', () => {
    const result = selectPracticeQuestions(bank, 10);
    const ids = result.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not always return the same first N items', () => {
    // Run 5 shuffles and check that at least one differs from the first 10 in order
    const firstSample = selectPracticeQuestions(bank, 10).map((item) => item.id);
    const samples = Array.from({ length: 5 }, () =>
      selectPracticeQuestions(bank, 10).map((item) => item.id),
    );
    const allIdentical = samples.every((s) => JSON.stringify(s) === JSON.stringify(firstSample));
    // With 20 items and Math.random, getting the same order 6 times in a row is virtually impossible
    expect(allIdentical).toBe(false);
  });
});
