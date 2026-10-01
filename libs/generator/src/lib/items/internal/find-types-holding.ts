import type { ItemRarity } from '@mander/model';
import { filter, isEmpty, some } from 'lodash-es';
import { match } from 'ts-pattern';
import { EVERYDAY_POOL_BY_TYPE } from '../../consts';
import type { ChestItemType } from '../types/chest-item-type';

export const findTypesHolding = (
  typesLeft: ChestItemType[],
  rarity: ItemRarity,
): ChestItemType[] =>
  match(
    filter(typesLeft, (type) => some(EVERYDAY_POOL_BY_TYPE[type], { rarity })),
  )
    .when(isEmpty, () => typesLeft)
    .otherwise((holding) => holding);
