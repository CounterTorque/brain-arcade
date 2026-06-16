# Triangle Math

**Puzzle ID:** `triangle-math`
**Difficulty:** easy
**Est. play time:** ~50 seconds

## How it plays

Each round shows **three numbers** across the top row with **operators** (+/−) between them. The player chains the arithmetic downward through a triangle:

1. **Row 2** — apply each operator to its pair of adjacent numbers (left pair → left blank, right pair → right blank).
2. **Row 3** — apply the operator between the two Row 2 results to get the final answer.

Fill all three blanks and hit **Submit** (or press Enter). Correct answers flash green with a bouncy pop; wrong ones shake red. After brief feedback the next round loads automatically. There are **5 rounds** total.

## Scoring

| Factor | Formula |
|--------|---------|
| Correct round | All 3 blanks right = 1 point |
| Score | `(correctRounds / 5) × 1000` |
| **Max** | **1 000** (all 5 rounds perfect) |

Accuracy only — speed is not factored in.

## Notes

- Uses `seed` via `makeRng` so today's instance is identical for every player.
- Numbers are 1–9; operators are randomly + or −. Answers can be negative.
- Styled with the shared theme tokens (see STYLE_GUIDE.md); no hard-coded colors/fonts.
- All logic is self-contained in this folder — no shared files modified.
