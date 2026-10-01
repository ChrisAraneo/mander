import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { concat, without } from 'lodash-es';
import { EVERYDAY_POOL_BY_TYPE } from '../../consts';
import type { ChestItemType } from '../types/chest-item-type';
import type { Deal } from './deal';
import { findItemsOfRarity } from './find-items-of-rarity';

export const takeType = (
  deal: Deal,
  type: ChestItemType,
  rarity: ItemRarity,
  random: ReturnType<typeof createRandom>,
): Deal => ({
  picked: concat(
    deal.picked,
    random.pick(findItemsOfRarity(EVERYDAY_POOL_BY_TYPE[type], rarity)),
  ),
  typesLeft: without(deal.typesLeft, type),
});
