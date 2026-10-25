import {
  BLUE_GEM,
  BULLET,
  DOUBLE_HEART,
  DOUBLE_STAR,
  FOUR_BULLETS,
  GREEN_GEM,
  HEART,
  type Item,
  type ItemRarity,
  PINK_GEM,
  PURPLE_GEM,
  RED_GEM,
  STAR,
  THREE_BULLETS,
  TRIPLE_HEART,
  TRIPLE_STAR,
  TWO_BULLETS,
  YELLOW_GEM,
} from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { flatMap } from 'lodash-es';
import type { ChestItemType } from './types/chest-item-type';

export const LEVELS_PER_DAY = 8;

export const FIRST_HARD_LEVEL = 7;

export const STRUCTURES_PER_LEVEL = 7;

export const STRUCTURE_WORLD_REPEATS = 3;

export const KEY_HEIGHT = 1;

export const CHEST_HEIGHT = 1;

export const CHEST_PORTAL_GAP = 2;

export const GEMS_PER_STRUCTURE = 5;

export const GEM_REST_HEIGHT = 2;

export const GEM_GAP = 2;

export const SLOT_WIDTH = STRUCTURE_WIDTH / GEMS_PER_STRUCTURE;

export const DIRT_DEPTH = 3;

export const DEEP_DIRT_DEPTH = 4;

export const STONE_FLAG = 1;

export const SKY_HEIGHT = 20;

export const ENTITY_HUE = 24;

export const VERTICAL_GROUND_DEPTH = 3;

export const CHEST_ITEM_COUNT = 3;

export const CHEST_ITEM_TYPES: readonly ChestItemType[] = Object.freeze([
  'GEM',
  'BULLET',
  'HEART',
  'STAR',
]);

export const CHEST_POOL_BY_TYPE: Readonly<Record<ChestItemType, Item[]>> =
  Object.freeze({
    GEM: [RED_GEM, GREEN_GEM, YELLOW_GEM, BLUE_GEM, PURPLE_GEM, PINK_GEM],
    BULLET: [BULLET, TWO_BULLETS, THREE_BULLETS, FOUR_BULLETS],
    HEART: [HEART, DOUBLE_HEART, TRIPLE_HEART],
    STAR: [STAR, DOUBLE_STAR, TRIPLE_STAR],
  });

export const CHEST_ITEM_POOL: readonly Item[] = Object.freeze(
  flatMap(CHEST_ITEM_TYPES, (type) => CHEST_POOL_BY_TYPE[type]),
);

export const RARITY_CHANCE: Readonly<Record<ItemRarity, number>> =
  Object.freeze({
    COMMON: 0.79,
    RARE: 0.21,
  });
