import type { Item } from '@mander/model';
import type { ChestItemType } from '../../../types/chest-item-type';

export interface ChestPicking {
  picked: Item[];
  typesLeft: ChestItemType[];
}
