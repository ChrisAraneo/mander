import { describe, expect, it } from 'vitest';

import type { RunRecord } from '../types/run-record';
import { toPlayedFromRun } from './to-played-from-run';

const RUN: RunRecord = {
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '2026-09-04T10:00:00Z',
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
};

describe('toPlayedFromRun', () => {
  it('should list the world of the run as played once when it turns the run into a played world', () => {
    expect(toPlayedFromRun(RUN)).toEqual({
      name: 'ABC',
      day: '2026-09-04',
      playedAt: '2026-09-04T10:00:00Z',
      runs: 1,
    });
  });

  it('should give no play moment when the run has none', () => {
    expect(toPlayedFromRun({ ...RUN, playedAt: '' }).playedAt).toBe('');
  });
});
