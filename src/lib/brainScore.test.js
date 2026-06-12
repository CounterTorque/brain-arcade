import { describe, it, expect } from 'vitest';
import { brainScore } from './brainScore.js';

describe('brainScore', () => {
  it('returns 0 for no results', () => {
    expect(brainScore([])).toBe(0);
    expect(brainScore(null)).toBe(0);
    expect(brainScore(undefined)).toBe(0);
  });

  it('returns the single score for one result', () => {
    expect(brainScore([{ score: 750 }])).toBe(750);
  });

  it('averages multiple scores and rounds', () => {
    expect(brainScore([{ score: 1000 }, { score: 1000 }, { score: 1000 }])).toBe(1000);
    expect(brainScore([{ score: 100 }, { score: 200 }])).toBe(150);
    expect(brainScore([{ score: 100 }, { score: 101 }])).toBe(101); // 100.5 → 101
  });

  it('treats missing/non-numeric scores as 0', () => {
    expect(brainScore([{ score: 300 }, {}, { score: 'x' }])).toBe(100); // (300+0+0)/3
  });
});
