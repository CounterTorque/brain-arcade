// Score store — the single interface all scores flow through (DESIGN.md §6).
// Puzzles never see this; the shell saves/reads through it. Swapping in a cloud
// store later (v2) means implementing this same shape — no puzzle or shell changes.
//
//   saveResult(date, puzzleId, score) → Promise<void>
//   getResults(date)                  → Promise<Result[]>   // this user, this day
//   getHistory(puzzleId?)             → Promise<Result[]>   // this user, trend lines
//
// Result = { dayKey: number, puzzleId: string, score: number, ts: number }
import { dateSeed } from './seededRandom.js';

const STORAGE_KEY = 'brain-arcade:results';

// Normalize a Date (or an already-numeric day key) to the canonical YYYYMMDD integer
// used as the per-day identity, so saves and reads always agree.
function toDayKey(date) {
  return date instanceof Date ? dateSeed(date) : Number(date);
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Missing/corrupt/unavailable storage → behave as empty rather than throwing.
    return [];
  }
}

function writeAll(results) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Storage full or unavailable — degrade silently; scores are non-critical in v1.
  }
}

export const localStorageScoreStore = {
  async saveResult(date, puzzleId, score) {
    const results = readAll();
    results.push({ dayKey: toDayKey(date), puzzleId, score, ts: Date.now() });
    writeAll(results);
  },

  async getResults(date) {
    const dayKey = toDayKey(date);
    return readAll().filter((r) => r.dayKey === dayKey);
  },

  // Full history (optionally for one puzzle), oldest → newest, for trend lines.
  async getHistory(puzzleId) {
    return readAll()
      .filter((r) => (puzzleId ? r.puzzleId === puzzleId : true))
      .sort((a, b) => a.ts - b.ts);
  },
};

// The shell depends on this singleton (the interface), not a concrete backend.
export const scoreStore = localStorageScoreStore;
