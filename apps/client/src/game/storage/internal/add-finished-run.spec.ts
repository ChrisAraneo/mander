import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { FinishedRun } from '../types/finished-run';
import type { SaveData } from '../types/save-data';
import { addFinishedRun } from './add-finished-run';
import { createRunId } from './create-run-id';

const RANDOM = constant(0.5);

const createRun = (patch: Partial<FinishedRun> = {}): FinishedRun => ({
  name: 'ABC',
  day: '2026-09-04',
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
  ...patch,
});

const createSave = (): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
});

describe('addFinishedRun', () => {
  it('should file the run with its id and the moment it ended', () => {
    expect(
      addFinishedRun(createSave(), createRun(), 'NOW', RANDOM).runs,
    ).toEqual([
      {
        ...createRun(),
        id: createRunId('ABC', 'NOW', RANDOM),
        playedAt: 'NOW',
      },
    ]);
  });

  it('should file a world record when the run was finished', () => {
    const save = addFinishedRun(
      createSave(),
      createRun({ outcome: 'COMPLETE', score: 900, seconds: 61 }),
      'NOW',
      RANDOM,
    );

    expect(save.completedWorlds).toEqual([
      {
        name: 'ABC',
        day: '2026-09-04',
        score: 900,
        seconds: 61,
        runId: save.runs[0].id,
        replay: createRun().replay,
      },
    ]);
  });

  it('should file no world record when the run ended in death', () => {
    expect(
      addFinishedRun(createSave(), createRun(), 'NOW', RANDOM).completedWorlds,
    ).toEqual([]);
  });

  it('should file no world record when the run was left unfinished', () => {
    expect(
      addFinishedRun(
        createSave(),
        createRun({ outcome: 'ABANDONED' }),
        'NOW',
        RANDOM,
      ).completedWorlds,
    ).toEqual([]);
  });

  it('should give the same id when the same random draw is used', () => {
    expect(
      addFinishedRun(createSave(), createRun(), 'NOW', constant(0.3)).runs[0]
        .id,
    ).toBe(
      addFinishedRun(createSave(), createRun(), 'NOW', constant(0.3)).runs[0]
        .id,
    );
  });

  it('should give another id when another random draw is used', () => {
    expect(
      addFinishedRun(createSave(), createRun(), 'NOW', constant(0.3)).runs[0]
        .id,
    ).not.toBe(
      addFinishedRun(createSave(), createRun(), 'NOW', constant(0.4)).runs[0]
        .id,
    );
  });

  it('should not change the old save when it files a run', () => {
    const save = createSave();

    addFinishedRun(save, createRun({ outcome: 'COMPLETE' }), 'NOW', RANDOM);

    expect(save).toEqual(createSave());
  });
});
