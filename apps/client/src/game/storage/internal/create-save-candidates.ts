import { concat, map, range, size, takeRight } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { REPLAYS_KEPT, RUNS_KEPT } from '../consts';
import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';
import type { Rung } from './types/rung';

const RUNGS: readonly Rung[] = Object.freeze(
  concat(
    map(range(RUNS_KEPT, -1, -1), (runs): Rung => [runs, REPLAYS_KEPT]),
    map(range(REPLAYS_KEPT - 1, -1, -1), (worlds): Rung => [0, worlds]),
  ),
);

const sliceNewestRuns = (save: SaveData, count: number): SaveData => ({
  ...save,
  runs: takeRight(save.runs, count),
});

const removeOldReplays = (save: SaveData, count: number): SaveData => ({
  ...save,
  completedWorlds: map(save.completedWorlds, (world, index) =>
    match(index >= size(save.completedWorlds) - count)
      .with(true, () => world)
      .otherwise((): CompletedWorld => ({ ...world, replay: null })),
  ),
});

const cloneTrimmedSave = (save: SaveData, [runs, worlds]: Rung): SaveData =>
  pipe(
    save,
    (full) => sliceNewestRuns(full, runs),
    (sliced) => removeOldReplays(sliced, worlds),
  );

export const createSaveCandidates = (save: SaveData): SaveData[] =>
  map(RUNGS, (rung) => cloneTrimmedSave(save, rung));
