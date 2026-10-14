import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { concat, without } from 'lodash-es';
import { EVERYDAY_POOL_BY_TYPE } from '../../consts';
import type { ChestItemType } from '../../types/chest-item-type';
import { filterItemsOfRarity } from './filter-items-of-rarity';
import type { ChestPicking } from './types/chest-picking';

export const takeRandomItemOfType = (
  picking: ChestPicking,
  type: ChestItemType,
  rarity: ItemRarity,
  random: ReturnType<typeof createRandom>,
): ChestPicking => ({
  picked: concat(
    picking.picked,
    random.pick(filterItemsOfRarity(EVERYDAY_POOL_BY_TYPE[type], rarity)),
  ),
  typesLeft: without(picking.typesLeft, type),
});
