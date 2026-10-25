import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import type { RunRecord } from '../types/run-record';
import { createMissingBestRuns } from './create-missing-best-runs';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 0]] };

const COMPLETED: CompletedWorld = {
  name: 'ABC',
  day: '2026-09-04',
  score: 900,
  seconds: 61,
  runId: 'RUN-1',
  replay: REPLAY,
};

const RUN: RunRecord = {
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: 'NOW',
  outcome: 'COMPLETE',
  score: 900,
  seconds: 61,
  levelIndex: 0,
  replay: REPLAY,
};

describe('createMissingBestRuns', () => {
  it('should bring back the best run when its run is no longer in the archive', () => {
    expect(createMissingBestRuns(COMPLETED, [])).toEqual([
      {
        id: 'ABC:best',
        name: 'ABC',
        day: '2026-09-04',
        playedAt: '',
        outcome: 'COMPLETE',
        score: 900,
        seconds: 61,
        levelIndex: 0,
        replay: REPLAY,
      },
    ]);
  });

  it('should add nothing when the best run is still in the archive', () => {
    expect(createMissingBestRuns(COMPLETED, [RUN])).toEqual([]);
  });

  it('should add nothing when the best run lost its replay', () => {
    expect(createMissingBestRuns({ ...COMPLETED, replay: null }, [])).toEqual(
      [],
    );
  });

  it('should add nothing when the world was never finished', () => {
    expect(createMissingBestRuns(null, [])).toEqual([]);
  });
});
