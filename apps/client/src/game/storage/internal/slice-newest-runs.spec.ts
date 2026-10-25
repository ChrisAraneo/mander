import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { sliceNewestRuns } from './slice-newest-runs';

const createRun = (index: number): RunRecord => ({
  id: `RUN-${index}`,
  name: 'ABC',
  day: '',
  playedAt: '',
  outcome: 'GAME_OVER',
  score: 0,
  seconds: 0,
  levelIndex: 0,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
});

const createSave = (): SaveData => ({
  score: 7,
  completedWorlds: [],
  playedWorlds: [],
  runs: times(4, createRun),
});

describe('sliceNewestRuns', () => {
  it('should keep only the newest runs when it slices the save', () => {
    expect(map(sliceNewestRuns(createSave(), 2).runs, (run) => run.id)).toEqual(
      ['RUN-2', 'RUN-3'],
    );
  });

  it('should keep the rest of the save when it slices the runs', () => {
    const save = createSave();

    const sliced = sliceNewestRuns(save, 2);

    expect(sliced.score).toBe(7);
    expect(sliced.completedWorlds).toBe(save.completedWorlds);
    expect(sliced.playedWorlds).toBe(save.playedWorlds);
  });

  it('should keep no runs when the count is zero', () => {
    expect(sliceNewestRuns(createSave(), 0).runs).toEqual([]);
  });

  it('should not change the old save when it slices the runs', () => {
    const save = createSave();

    sliceNewestRuns(save, 1);

    expect(save).toEqual(createSave());
  });
});
