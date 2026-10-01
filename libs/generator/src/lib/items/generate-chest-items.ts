import { flow } from 'lodash-es';
import { countChestEpics } from './internal/count-chest-epics';
import { createChestRandom } from './internal/create-chest-random';
import { pickChestItems } from './internal/pick-chest-items';
import { pickChestRarities } from './internal/pick-chest-rarities';

export const generateChestItems = (seed: string) =>
  flow(
    createChestRandom,
    pickChestRarities,
    countChestEpics,
    pickChestItems,
  )({ seed });
