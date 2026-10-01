import type { Item } from '@mander/model';
import type { ChestItemType } from '../types/chest-item-type';

export interface Picking {
  picked: Item[];
  typesLeft: ChestItemType[];
}
