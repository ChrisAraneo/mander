import type { createRandom } from '@mander/engine';
import type { Item, ItemRarity } from '@mander/model';
import { filter, isEmpty, reduce } from 'lodash-es';
import { CHEST_ITEM_TYPES, EVERYDAY_POOL_BY_TYPE } from '../../consts';
import type { ChestItemType } from '../../types/chest-item-type';
import { takeRandomCard } from './take-random-card';
import type { ChestPicking } from './types/chest-picking';

const EVERYDAY_TYPES: readonly ChestItemType[] = Object.freeze(
  filter(CHEST_ITEM_TYPES, (type) => !isEmpty(EVERYDAY_POOL_BY_TYPE[type])),
);

export const takeRandomEverydayItems = (
  rarities: ItemRarity[],
  random: ReturnType<typeof createRandom>,
): Item[] =>
  reduce(
    rarities,
    (picking: ChestPicking, rarity): ChestPicking =>
      takeRandomCard(picking, rarity, random),
    { picked: [], typesLeft: [...EVERYDAY_TYPES] },
  ).picked;
