import { DOUBLE_HEART, HEART, type Item, RED_DIAMOND } from '@mander/model';
import { createRandom } from '@mander/utils';
import { size, sortBy, take } from 'lodash-es';

const CHEST_ITEM_COUNT = 1;

const ITEM_POOL: readonly Item[] = Object.freeze([
  HEART,
  DOUBLE_HEART,
  RED_DIAMOND,
]);

export const generateChestItems = (seed: string): Item[] => {
  const random = createRandom(seed);

  return take(
    sortBy(ITEM_POOL, () => random.next()),
    Math.min(CHEST_ITEM_COUNT, size(ITEM_POOL)),
  );
};
