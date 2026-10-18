import type { createRandom } from '@mander/engine';
import type { Item } from '@mander/model';
import { flow } from 'lodash-es';
import { countChestEpics } from './internal/count-chest-epics';
import { takeRandomChestItemsByRarity } from './internal/take-random-chest-items-by-rarity';
import { takeRandomChestRarities } from './internal/take-random-chest-rarities';

export const takeRandomChestItems = (
  random: ReturnType<typeof createRandom>,
): Item[] =>
  flow(
    takeRandomChestRarities,
    countChestEpics,
    takeRandomChestItemsByRarity,
  )({ random });
