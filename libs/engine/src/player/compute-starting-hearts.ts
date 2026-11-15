import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { getHeartsAmount } from '../item/get-hearts-amount';
import { BASE_HEARTS } from './consts';

export const computeStartingHearts = (inventory: readonly Item[]): number =>
  BASE_HEARTS + sumBy(inventory, getHeartsAmount);
