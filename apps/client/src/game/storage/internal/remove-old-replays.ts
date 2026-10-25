import { map, size } from 'lodash-es';
import { match } from 'ts-pattern';
import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';

export const removeOldReplays = (save: SaveData, count: number): SaveData => ({
  ...save,
  completedWorlds: map(save.completedWorlds, (world, index) =>
    match(index >= size(save.completedWorlds) - count)
      .with(true, () => world)
      .otherwise((): CompletedWorld => ({ ...world, replay: null })),
  ),
});
