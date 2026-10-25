import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { cloneTrimmedSave } from './clone-trimmed-save';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 0]] };

const createRun = (index: number): RunRecord => ({
  id: `RUN-${index}`,
  name: 'ABC',
  day: '',
  playedAt: '',
  outcome: 'GAME_OVER',
  score: 0,
  seconds: 0,
  levelIndex: 0,
  replay: REPLAY,
});

const createWorld = (index: number): CompletedWorld => ({
  name: `W${index}`,
  day: '',
  score: 0,
  seconds: 0,
  runId: '',
  replay: REPLAY,
});

const createSave = (): SaveData => ({
  score: 7,
  completedWorlds: times(3, createWorld),
  playedWorlds: [],
  runs: times(3, createRun),
});

describe('cloneTrimmedSave', () => {
  it('should keep the newest runs and replays when it trims the save', () => {
    const trimmed = cloneTrimmedSave(createSave(), [1, 2]);

    expect(map(trimmed.runs, (run) => run.id)).toEqual(['RUN-2']);
    expect(
      map(trimmed.completedWorlds, (world) => world.replay !== null),
    ).toEqual([false, true, true]);
  });

  it('should keep the score when it trims the save', () => {
    expect(cloneTrimmedSave(createSave(), [0, 0]).score).toBe(7);
  });

  it('should keep no runs and no replays when the rung keeps nothing', () => {
    const trimmed = cloneTrimmedSave(createSave(), [0, 0]);

    expect(trimmed.runs).toEqual([]);
    expect(map(trimmed.completedWorlds, (world) => world.replay)).toEqual([
      null,
      null,
      null,
    ]);
  });

  it('should not change the old save when it trims the save', () => {
    const save = createSave();

    cloneTrimmedSave(save, [0, 0]);

    expect(save).toEqual(createSave());
  });
});
