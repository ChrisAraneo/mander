import { clone, sumBy } from 'lodash-es';
import type { Item } from '../types';
import type { Rng } from '../rng';
import type { CatalogEntry } from './catalog-entry';
import { CHEST_ITEM_COUNT } from './constants';
import { ITEM_CATALOG } from './item-catalog';

export function rollChestItems(rng: Rng): Item[] {
  const pool = clone(ITEM_CATALOG) as CatalogEntry[];
  const rolled: Item[] = [];
  while (rolled.length < CHEST_ITEM_COUNT && pool.length > 0) {
    let remainingWeight = rng.next() * sumBy(pool, 'weight');
    let chosenIndex = 0;
    for (let poolIndex = 0; poolIndex < pool.length; poolIndex++) {
      remainingWeight -= pool[poolIndex].weight;
      if (remainingWeight <= 0) {
        chosenIndex = poolIndex;
        break;
      }
    }
    rolled.push(pool[chosenIndex].item);
    pool.splice(chosenIndex, 1);
  }
  return rolled;
}
