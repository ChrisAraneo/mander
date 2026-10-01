import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { countChestEpics } from './internal/count-chest-epics';
import { pickRandomChestItems } from './internal/pick-random-chest-items';
import { pickRandomChestRarities } from './internal/pick-random-chest-rarities';

export const generateChestItems = (random: ReturnType<typeof createRandom>) =>
  flow(
    pickRandomChestRarities,
    countChestEpics,
    pickRandomChestItems,
  )({ random });
