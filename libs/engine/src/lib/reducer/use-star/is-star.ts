import type { Item } from '@mander/model';
import { filter, size } from 'lodash-es';

export const isStar = (item: Item): boolean => item.effect.kind === 'STAR';

export const starCount = (inventory: readonly Item[]): number =>
  size(filter(inventory, isStar));
