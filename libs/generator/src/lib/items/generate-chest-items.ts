import {
  DOUBLE_HEART,
  HEART,
  type Item,
  type ItemRarity,
  RED_DIAMOND,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import { size, sortBy, take } from 'lodash-es';

const CHEST_ITEM_COUNT = 1;

const ITEM_POOL: readonly Item[] = Object.freeze([
  HEART,
  DOUBLE_HEART,
  RED_DIAMOND,
]);

const RARITY_WEIGHT: Readonly<Record<ItemRarity, number>> = Object.freeze({
  COMMON: 6,
  RARE: 3,
  EPIC: 1,
});

const seedFor = (seed: string): string => `${seed}#chest`;

const drawKey = (item: Item, roll: number): number =>
  -(roll ** (1 / RARITY_WEIGHT[item.rarity]));

export const generateChestItems = (seed: string): Item[] => {
  const random = createRandom(seedFor(seed));

  return take(
    sortBy(ITEM_POOL, (item) => drawKey(item, random.next())),
    Math.min(CHEST_ITEM_COUNT, size(ITEM_POOL)),
  );
};
