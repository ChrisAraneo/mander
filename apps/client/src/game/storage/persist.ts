import { find, map, range, size, takeRight } from 'lodash-es';
import { tryCatch } from 'ramda';

import { REPLAYS_KEPT, RUNS_KEPT, STORAGE_KEY } from './consts';
import type { SaveData } from './save-data';

type Rung = [runs: number, worlds: number];

const keepRuns = (save: SaveData, keep: number): SaveData => ({
  ...save,
  runs: takeRight(save.runs, keep),
});

const keepReplays = (save: SaveData, keep: number): SaveData => ({
  ...save,
  completedWorlds: map(save.completedWorlds, (world, index) =>
    index >= size(save.completedWorlds) - keep
      ? world
      : { ...world, replay: null },
  ),
});

const trimSave = (save: SaveData, [runs, worlds]: Rung): SaveData =>
  keepReplays(keepRuns(save, runs), worlds);

const listRungs = (): Rung[] => [
  ...map(range(RUNS_KEPT, -1, -1), (runs): Rung => [runs, REPLAYS_KEPT]),
  ...map(range(REPLAYS_KEPT - 1, -1, -1), (worlds): Rung => [0, worlds]),
];

const isWritten: (save: SaveData) => boolean = tryCatch(
  (save: SaveData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));

    return true;
  },
  () => false,
);

export const persist = (save: SaveData): void => {
  find(
    map(listRungs(), (rung) => trimSave(save, rung)),
    isWritten,
  );
};
