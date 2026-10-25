import { type Random, takeRandom } from '@mander/engine';
import type { ItemRarity } from '@mander/model';
import { concat, without } from 'lodash-es';
import { CHEST_POOL_BY_TYPE } from '../../consts';
import type { ChestItemType } from '../../types/chest-item-type';
import { filterItemsOfRarity } from './filter-items-of-rarity';
import type { ChestPicking } from './types/chest-picking';

export const takeRandomItemOfType = (
  picking: ChestPicking,
  type: ChestItemType,
  rarity: ItemRarity,
  random: Random,
): ChestPicking => ({
  picked: concat(
    picking.picked,
    takeRandom(filterItemsOfRarity(CHEST_POOL_BY_TYPE[type], rarity), random),
  ),
  typesLeft: without(picking.typesLeft, type),
});
