import type { createRandom } from '@mander/engine';
import type { Item, ItemRarity } from '@mander/model';
import { reduce } from 'lodash-es';
import { CHEST_ITEM_TYPES } from '../../consts';
import { takeRandomCard } from './take-random-card';
import type { ChestPicking } from './types/chest-picking';

export const takeRandomEverydayItems = (
  rarities: ItemRarity[],
  random: ReturnType<typeof createRandom>,
): Item[] =>
  reduce(
    rarities,
    (picking: ChestPicking, rarity): ChestPicking =>
      takeRandomCard(picking, rarity, random),
    { picked: [], typesLeft: [...CHEST_ITEM_TYPES] },
  ).picked;
