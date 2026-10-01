import type { Item, ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { filter, isEmpty, reduce } from 'lodash-es';
import { CHEST_ITEM_TYPES, EVERYDAY_POOL_BY_TYPE } from '../../consts';
import type { ChestItemType } from '../types/chest-item-type';
import type { Picking } from './picking';
import { pickCard } from './pick-card';

const EVERYDAY_TYPES: readonly ChestItemType[] = Object.freeze(
  filter(CHEST_ITEM_TYPES, (type) => !isEmpty(EVERYDAY_POOL_BY_TYPE[type])),
);

export const pickChest = (
  rarities: ItemRarity[],
  random: ReturnType<typeof createRandom>,
): Item[] =>
  reduce(
    rarities,
    (picking: Picking, rarity): Picking => pickCard(picking, rarity, random),
    { picked: [], typesLeft: [...EVERYDAY_TYPES] },
  ).picked;
