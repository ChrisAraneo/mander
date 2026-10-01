import type { Item } from '@mander/model';
import { find, some } from 'lodash-es';
import { CHEST_ITEM_TYPES, CHEST_POOL_BY_TYPE } from '../../consts';
import type { ChestItemType } from '../types/chest-item-type';

export const getChestType = (item: Item): ChestItemType | undefined =>
  find(CHEST_ITEM_TYPES, (type) =>
    some(CHEST_POOL_BY_TYPE[type], { id: item.id }),
  );
