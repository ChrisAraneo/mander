import { find, map, range, size } from 'lodash-es';
import { tryCatch } from 'ramda';

import { REPLAYS_KEPT, STORAGE_KEY } from './consts';
import type { SaveData } from './save-data';

const withReplaysKept = (save: SaveData, keep: number): SaveData => ({
  ...save,
  completedWorlds: map(save.completedWorlds, (world, index) =>
    index >= size(save.completedWorlds) - keep
      ? world
      : { ...world, replay: null },
  ),
});

const write: (save: SaveData) => boolean = tryCatch(
  (save: SaveData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));

    return true;
  },
  () => false,
);

export const persist = (save: SaveData): void => {
  find(
    map(range(REPLAYS_KEPT, -1, -1), (keep) => withReplaysKept(save, keep)),
    write,
  );
};
