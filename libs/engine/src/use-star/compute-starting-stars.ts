import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { getStarsAmount } from '../item/get-stars-amount';

export const computeStartingStars = (inventory: readonly Item[]): number =>
  sumBy(inventory, getStarsAmount);
