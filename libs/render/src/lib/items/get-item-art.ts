import {
  HEART,
  DOUBLE_HEART,
  TRIPLE_HEART,
  STAR,
  DOUBLE_STAR,
  RED_GEM,
  GREEN_GEM,
  YELLOW_GEM,
  BLUE_GEM,
  PURPLE_GEM,
  PINK_GEM,
  BOOTS_OF_CLOUDS,
  TITANIUM_HELMET,
  type Item,
} from '@mander/model';
import {
  RED_GEM_COLORS,
  GREEN_GEM_COLORS,
  YELLOW_GEM_COLORS,
  BLUE_GEM_COLORS,
  PURPLE_GEM_COLORS,
  PINK_GEM_COLORS,
} from '../gem-shape/consts';
import { createCountedArt } from './internal/create-counted-art';
import { createGemArt } from './internal/create-gem-art';
import { createStarsArt } from './internal/create-stars-art';
import { toEffectItemArt } from './internal/to-effect-item-art';
import type { ItemArt } from './types/item-art';

const ART_BY_ITEM_ID: Readonly<Partial<Record<string, ItemArt>>> =
  Object.freeze({
    [HEART.id]: createCountedArt('HEARTS', 1),
    [DOUBLE_HEART.id]: createCountedArt('HEARTS', 2),
    [TRIPLE_HEART.id]: createCountedArt('HEARTS', 3),
    [STAR.id]: createStarsArt(1),
    [DOUBLE_STAR.id]: createStarsArt(2),
    [RED_GEM.id]: createGemArt(RED_GEM_COLORS),
    [GREEN_GEM.id]: createGemArt(GREEN_GEM_COLORS),
    [YELLOW_GEM.id]: createGemArt(YELLOW_GEM_COLORS),
    [BLUE_GEM.id]: createGemArt(BLUE_GEM_COLORS),
    [PURPLE_GEM.id]: createGemArt(PURPLE_GEM_COLORS),
    [PINK_GEM.id]: createGemArt(PINK_GEM_COLORS),
    [BOOTS_OF_CLOUDS.id]: { kind: 'BOOTS' },
    [TITANIUM_HELMET.id]: { kind: 'HELMET' },
  });

export const getItemArt = (item: Item): ItemArt =>
  ART_BY_ITEM_ID[item.id] ?? toEffectItemArt(item);
