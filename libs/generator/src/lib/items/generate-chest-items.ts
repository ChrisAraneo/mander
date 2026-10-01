import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { countChestEpics } from './internal/count-chest-epics';
import { pickChestItems } from './internal/pick-chest-items';
import { pickChestRarities } from './internal/pick-chest-rarities';

export const generateChestItems = (random: ReturnType<typeof createRandom>) =>
  flow(pickChestRarities, countChestEpics, pickChestItems)({ random });
