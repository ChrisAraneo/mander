import { sumBy } from 'lodash-es';

import type { Rng } from '../rng';
import type { Item } from '../types';
import type { CatalogEntry } from './catalog-entry';
import { CHEST_ITEM_COUNT } from './constants';
import { ITEM_CATALOG } from './item-catalog';

export const rollChestItems = (rng: Rng): Item[] => {
  const pool: CatalogEntry[] = [...ITEM_CATALOG];
  const rolled: Item[] = [];
  while (rolled.length < CHEST_ITEM_COUNT && pool.length > 0) {
    let remainingWeight = rng.next() * sumBy(pool, 'weight');
    let chosenIndex = 0;
    for (const [poolIndex, element] of pool.entries()) {
      remainingWeight -= element.weight;
      if (remainingWeight <= 0) {
        chosenIndex = poolIndex;
        break;
      }
    }
    rolled.push(pool[chosenIndex].item);
    pool.splice(chosenIndex, 1);
  }
  return rolled;
};
