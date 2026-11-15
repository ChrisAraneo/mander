import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { getBulletsAmount } from '../item/get-bullets-amount';
import { BASE_AMMO } from './consts';

export const computeStartingAmmo = (inventory: readonly Item[]): number =>
  BASE_AMMO + sumBy(inventory, getBulletsAmount);
