import { HEART, type Item } from '@mander/model';
import { createRandom } from '@mander/utils';
import { size, sortBy, take } from 'lodash-es';

/** How much a chest holds. */
const CHEST_ITEM_COUNT = 1;

/**
 * Everything a chest can hold. One entry for now, so every chest carries the
 * same thing — the draw below is what makes room for the second.
 */
const ITEM_POOL: readonly Item[] = Object.freeze([HEART]);

/**
 * What the chest in this level holds, decided by the level's own seed so the
 * same day always gives the same reward. Items are drawn without replacement,
 * so a chest never holds two of the same thing.
 */
export const generateChestItems = (seed: string): Item[] => {
  const random = createRandom(seed);

  return take(
    sortBy(ITEM_POOL, () => random.next()),
    Math.min(CHEST_ITEM_COUNT, size(ITEM_POOL)),
  );
};
