import { describe, expect, it } from 'vitest';

import { parseCompletedWorlds } from './parse-completed-worlds';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 1]] };

describe('parseCompletedWorlds', () => {
  it('should read every field when the world was stored whole', () => {
    expect(
      parseCompletedWorlds([
        {
          name: 'ABC',
          day: '2026-09-04',
          score: 900,
          seconds: 61,
          runId: 'RUN-1',
          replay: REPLAY,
        },
      ]),
    ).toEqual([
      {
        name: 'ABC',
        day: '2026-09-04',
        score: 900,
        seconds: 61,
        runId: 'RUN-1',
        replay: REPLAY,
      },
    ]);
  });

  it('should fill in the missing fields when an old world was stored with only its name', () => {
    expect(parseCompletedWorlds([{ name: 'OLD' }])).toEqual([
      { name: 'OLD', day: '', score: 0, seconds: 0, runId: '', replay: null },
    ]);
  });

  it('should drop the world when it has no name', () => {
    expect(parseCompletedWorlds([{ score: 900 }, 'ABC'])).toEqual([]);
  });

  it('should give no worlds when the stored value is not a list', () => {
    expect(parseCompletedWorlds(undefined)).toEqual([]);
  });
});
