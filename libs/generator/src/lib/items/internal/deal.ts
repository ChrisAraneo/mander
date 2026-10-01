import type { Item } from '@mander/model';
import type { ChestItemType } from '../types/chest-item-type';

export interface Deal {
  picked: Item[];
  typesLeft: ChestItemType[];
}
