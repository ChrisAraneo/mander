import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { RUNS_KEPT } from '../consts';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { addRun } from './add-run';

const createRun = (id: string, score = 120): RunRecord => ({
  id,
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '',
  outcome: 'GAME_OVER',
  score,
  seconds: 45,
  levelIndex: 2,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
});

const createSave = (runs: RunRecord[]): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs,
});

const toIds = (save: SaveData): string[] => map(save.runs, (run) => run.id);

describe('addRun', () => {
  it('should put the run at the end when it adds it', () => {
    expect(toIds(addRun(createSave([createRun('A')]), createRun('B')))).toEqual(
      ['A', 'B'],
    );
  });

  it('should replace the earlier copy when the run is already there', () => {
    const save = addRun(
      createSave([createRun('A', 1), createRun('B')]),
      createRun('A', 2),
    );

    expect(toIds(save)).toEqual(['B', 'A']);
    expect(save.runs[1].score).toBe(2);
  });

  it('should let go of the oldest run when the shelf is full', () => {
    const save = addRun(
      createSave(times(RUNS_KEPT, (index) => createRun(`RUN-${index}`))),
      createRun('NEW'),
    );

    expect(toIds(save)[0]).toBe('RUN-1');
    expect(toIds(save)).toHaveLength(RUNS_KEPT);
  });

  it('should hold just the run when the save had none', () => {
    expect(toIds(addRun(createSave([]), createRun('A')))).toEqual(['A']);
  });

  it('should not change the old save when it adds a run', () => {
    const save = createSave([createRun('A')]);

    addRun(save, createRun('B'));

    expect(save).toEqual(createSave([createRun('A')]));
  });
});
