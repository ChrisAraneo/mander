import { filter, head, last, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { REPLAYS_KEPT, RUNS_KEPT } from '../consts';
import type { CompletedWorld } from '../types/completed-world';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { createSaveCandidates } from './create-save-candidates';

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
  completedWorlds: times(REPLAYS_KEPT + 2, createWorld),
  playedWorlds: [],
  runs: times(RUNS_KEPT, createRun),
});

const countReplays = (save: SaveData): number =>
  size(filter(save.completedWorlds, (world) => world.replay !== null));

describe('createSaveCandidates', () => {
  it('should try the whole save first when it lists the candidates', () => {
    expect(head(createSaveCandidates(createSave()))).toEqual({
      ...createSave(),
      completedWorlds: [
        { ...createWorld(0), replay: null },
        { ...createWorld(1), replay: null },
        ...times(REPLAYS_KEPT, (index) => createWorld(index + 2)),
      ],
    });
  });

  it('should drop the oldest run first when it shrinks the save', () => {
    const [, second] = createSaveCandidates(createSave());

    expect(map(second.runs, (run) => run.id)).toEqual(
      times(RUNS_KEPT - 1, (index) => `RUN-${index + 1}`),
    );
  });

  it('should drop the oldest replays after the runs when it shrinks further', () => {
    const smallest = last(createSaveCandidates(createSave()));

    expect(smallest?.runs).toEqual([]);
    expect(countReplays(smallest ?? createSave())).toBe(0);
  });

  it('should keep the worlds and the score when it shrinks the save', () => {
    const smallest = last(createSaveCandidates(createSave()));

    expect(size(smallest?.completedWorlds)).toBe(REPLAYS_KEPT + 2);
    expect(smallest?.score).toBe(7);
  });

  it('should list one candidate per run and replay it can shed', () => {
    expect(createSaveCandidates(createSave())).toHaveLength(
      RUNS_KEPT + 1 + REPLAYS_KEPT,
    );
  });

  it('should not change the old save when it lists the candidates', () => {
    const save = createSave();

    createSaveCandidates(save);

    expect(save).toEqual(createSave());
  });
});
