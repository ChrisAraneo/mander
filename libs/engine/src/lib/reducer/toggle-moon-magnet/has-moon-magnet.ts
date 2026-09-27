import { type Item, MOON_MAGNET } from '@mander/model';
import { some } from 'lodash-es';

export const hasMoonMagnet = (inventory: readonly Item[]): boolean =>
  some(inventory, (item) => item.id === MOON_MAGNET.id);
