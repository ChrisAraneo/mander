import {
  BLUE_DIAMOND,
  DOUBLE_HEART,
  GREEN_DIAMOND,
  HEART,
  type Item,
  type ItemRarity,
  PURPLE_DIAMOND,
  RED_DIAMOND,
  STAR,
  TRIPLE_HEART,
  YELLOW_DIAMOND,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import { size, sortBy, take, uniqBy } from 'lodash-es';

export const CHEST_ITEM_COUNT = 3;

const ITEM_POOL: readonly Item[] = Object.freeze([
  HEART,
  DOUBLE_HEART,
  STAR,
  RED_DIAMOND,
  GREEN_DIAMOND,
  YELLOW_DIAMOND,
  BLUE_DIAMOND,
  TRIPLE_HEART,
  PURPLE_DIAMOND,
]);

export const CHEST_ITEM_POOL: readonly Item[] = Object.freeze(
  uniqBy(ITEM_POOL, (item) => item.id),
);

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
    sortBy(CHEST_ITEM_POOL, (item) => drawKey(item, random.next())),
    Math.min(CHEST_ITEM_COUNT, size(CHEST_ITEM_POOL)),
  );
};
