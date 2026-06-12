// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { scoreStore } from './scoreStore.js';

const DAY = new Date('2026-06-12');
const OTHER_DAY = new Date('2026-06-13');

describe('localStorageScoreStore', () => {
  beforeEach(() => localStorage.clear());

  it('saves a result and reads it back for that day', async () => {
    await scoreStore.saveResult(DAY, 'triangle-math', 800);
    const results = await scoreStore.getResults(DAY);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ puzzleId: 'triangle-math', score: 800 });
  });

  it('filters getResults by day', async () => {
    await scoreStore.saveResult(DAY, 'a', 100);
    await scoreStore.saveResult(OTHER_DAY, 'b', 200);
    expect(await scoreStore.getResults(DAY)).toHaveLength(1);
    expect((await scoreStore.getResults(OTHER_DAY))[0].puzzleId).toBe('b');
  });

  it('getHistory returns all results, optionally filtered by puzzle, oldest → newest', async () => {
    await scoreStore.saveResult(DAY, 'a', 100);
    await scoreStore.saveResult(OTHER_DAY, 'a', 300);
    await scoreStore.saveResult(DAY, 'b', 200);

    const all = await scoreStore.getHistory();
    expect(all).toHaveLength(3);
    expect(all.map((r) => r.ts)).toEqual([...all.map((r) => r.ts)].sort((x, y) => x - y));

    const onlyA = await scoreStore.getHistory('a');
    expect(onlyA.every((r) => r.puzzleId === 'a')).toBe(true);
    expect(onlyA).toHaveLength(2);
  });

  it('returns empty rather than throwing on corrupt storage', async () => {
    localStorage.setItem('brain-arcade:results', 'not json{');
    expect(await scoreStore.getResults(DAY)).toEqual([]);
    expect(await scoreStore.getHistory()).toEqual([]);
  });
});
