import { describe, it, expect } from 'vitest';
import { getDailySet, SESSION_SIZE } from './scheduler.js';

const REGISTRY = [
  { id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' },
];

const ids = (set) => set.puzzles.map((p) => p.manifest.id);

describe('getDailySet', () => {
  it('is deterministic for the same date', () => {
    const date = new Date('2026-06-12');
    expect(ids(getDailySet(REGISTRY, date))).toEqual(ids(getDailySet(REGISTRY, date)));
  });

  it('picks SESSION_SIZE puzzles by default', () => {
    const set = getDailySet(REGISTRY, new Date('2026-06-12'));
    expect(set.puzzles).toHaveLength(SESSION_SIZE);
  });

  it('clamps to the number available when the registry is short', () => {
    const set = getDailySet([{ id: 'only' }], new Date('2026-06-12'));
    expect(set.puzzles).toHaveLength(1);
  });

  it('returns an empty set (no throw) for an empty or missing registry', () => {
    expect(getDailySet([], new Date('2026-06-12')).puzzles).toEqual([]);
    expect(getDailySet(undefined, new Date('2026-06-12')).puzzles).toEqual([]);
  });

  it('gives each chosen puzzle a distinct, stable seed', () => {
    const date = new Date('2026-06-12');
    const seeds = getDailySet(REGISTRY, date).puzzles.map((p) => p.seed);
    expect(new Set(seeds).size).toBe(seeds.length);
    // stable across calls
    expect(getDailySet(REGISTRY, date).puzzles.map((p) => p.seed)).toEqual(seeds);
  });

  it('uses a different day seed for a different date', () => {
    const a = getDailySet(REGISTRY, new Date('2026-06-12')).seed;
    const b = getDailySet(REGISTRY, new Date('2026-06-13')).seed;
    expect(a).not.toBe(b);
  });

  it('does not mutate the input registry', () => {
    const input = REGISTRY.slice();
    getDailySet(input, new Date('2026-06-12'));
    expect(input).toEqual(REGISTRY);
  });
});
