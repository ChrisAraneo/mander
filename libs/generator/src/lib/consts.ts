import {
  BLUE_GEM,
  BOOTS_OF_CLOUDS,
  BULLET,
  DOUBLE_HEART,
  DOUBLE_STAR,
  FOUR_BULLETS,
  GREEN_GEM,
  HEART,
  type Item,
  type ItemRarity,
  MOON_MAGNET,
  PINK_GEM,
  PURPLE_GEM,
  RED_GEM,
  STAR,
  THREE_BULLETS,
  TITANIUM_HELMET,
  TRIPLE_HEART,
  TRIPLE_STAR,
  TWO_BULLETS,
  VAMPIRE_SLAYER_BULLET_RAIN,
  YELLOW_GEM,
} from '@mander/model';
import { filter, flatMap, mapValues, reject } from 'lodash-es';
import type { ChestItemType } from './items/types/chest-item-type';

export const LEVELS_PER_DAY = 8;

export const FIRST_HARD_LEVEL = 7;

export const STRUCTURES_PER_LEVEL = 7;

export const FIRST_MIXED_ENEMY_LEVEL = 3;

export const FIRST_HORNED_ENEMY_LEVEL = 6;

export const NO_HORNED_ENEMIES = 0;

export const ONLY_HORNED_ENEMIES = 1;

export const MIRRORED_LEVELS: readonly number[] = Object.freeze([3, 6]);

export const VERTICAL_LEVELS: readonly number[] = Object.freeze([2, 5]);

export const FIRST_CANNON_LEVEL = 5;

export const FIRST_FIREBALL_LEVEL = 4;

export const LAST_FIREBALL_LEVEL = 8;

export const SPIKE_REMOVAL_RATES: readonly number[] = Object.freeze([
  1, 0.8, 0.6, 0.3,
]);

export const BEARTRAP_REMOVAL_RATES: readonly number[] = Object.freeze([
  0.5, 0.35, 0.2,
]);

export const KEY_HEIGHT = 1;

export const CHEST_HEIGHT = 1;

export const CHEST_PORTAL_GAP = 2;

export const GEMS_PER_STRUCTURE = 5;

export const GEM_REST_HEIGHT = 2;

export const GEM_GAP = 2;

export const DIRT_DEPTH = 3;

export const DEEP_DIRT_DEPTH = 4;

export const SKY_HEIGHT = 20;

export const VERTICAL_GROUND_DEPTH = 3;

export const CHEST_ITEM_COUNT = 3;

export const CHEST_ITEM_TYPES: readonly ChestItemType[] = Object.freeze([
  'GEM',
  'BULLET',
  'HEART',
  'STAR',
  'GEAR',
]);

export const CHEST_POOL_BY_TYPE: Readonly<Record<ChestItemType, Item[]>> =
  Object.freeze({
    GEM: [RED_GEM, GREEN_GEM, YELLOW_GEM, BLUE_GEM, PURPLE_GEM, PINK_GEM],
    BULLET: [
      BULLET,
      TWO_BULLETS,
      THREE_BULLETS,
      FOUR_BULLETS,
      VAMPIRE_SLAYER_BULLET_RAIN,
    ],
    HEART: [HEART, DOUBLE_HEART, TRIPLE_HEART],
    STAR: [STAR, DOUBLE_STAR, TRIPLE_STAR],
    GEAR: [BOOTS_OF_CLOUDS, TITANIUM_HELMET, MOON_MAGNET],
  });

export const CHEST_ITEM_POOL: readonly Item[] = Object.freeze(
  flatMap(CHEST_ITEM_TYPES, (type) => CHEST_POOL_BY_TYPE[type]),
);

export const RARITY_CHANCE: Readonly<Record<ItemRarity, number>> =
  Object.freeze({
    COMMON: 0.79,
    RARE: 0.19,
    EPIC: 0.02,
  });

export const EPIC_POOL: readonly Item[] = Object.freeze(
  filter(CHEST_ITEM_POOL, { rarity: 'EPIC' }),
);

export const EVERYDAY_POOL_BY_TYPE: Readonly<Record<ChestItemType, Item[]>> =
  Object.freeze(
    mapValues(CHEST_POOL_BY_TYPE, (items) => reject(items, { rarity: 'EPIC' })),
  );
