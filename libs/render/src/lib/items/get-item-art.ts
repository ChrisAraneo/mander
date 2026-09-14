import {
  BLUE_GEM,
  BOOTS_OF_CLOUDS,
  DOUBLE_HEART,
  DOUBLE_STAR,
  GREEN_GEM,
  type HazardKind,
  HEART,
  type Item,
  PINK_GEM,
  PURPLE_GEM,
  RED_GEM,
  STAR,
  TITANIUM_HELMET,
  TRIPLE_HEART,
  YELLOW_GEM,
} from '@mander/model';
import { match } from 'ts-pattern';

import {
  BLUE_GEM_COLORS,
  type GemColors,
  GREEN_GEM_COLORS,
  PINK_GEM_COLORS,
  PURPLE_GEM_COLORS,
  RED_GEM_COLORS,
  YELLOW_GEM_COLORS,
} from '../gem-shape';
import { GOLD_STAR, type StarColors } from '../star';

export type ItemArt =
  | { kind: 'HEARTS'; count: number }
  | { kind: 'GEM'; colors: GemColors }
  | { kind: 'STARS'; count: number; colors: StarColors }
  | { kind: 'BULLETS'; count: number }
  | { kind: 'FIREBALLS'; count: number }
  | { kind: 'BOOTS' }
  | { kind: 'HELMET' };

const createGemArt = (colors: GemColors): ItemArt => ({ kind: 'GEM', colors });

const createHeartsArt = (count: number): ItemArt => ({ kind: 'HEARTS', count });

const createStarsArt = (count: number): ItemArt => ({
  kind: 'STARS',
  count,
  colors: GOLD_STAR,
});

const createBulletsArt = (count: number): ItemArt => ({
  kind: 'BULLETS',
  count,
});

const createFireballsArt = (count: number): ItemArt => ({
  kind: 'FIREBALLS',
  count,
});

const createWardArt = (hazard: HazardKind): ItemArt =>
  match(hazard)
    .with('CEILING_SPIKE', (): ItemArt => ({ kind: 'HELMET' }))
    .otherwise((): ItemArt => ({ kind: 'BOOTS' }));

const ART_BY_ITEM_ID: Readonly<Partial<Record<string, ItemArt>>> =
  Object.freeze({
    [HEART.id]: createHeartsArt(1),
    [DOUBLE_HEART.id]: createHeartsArt(2),
    [TRIPLE_HEART.id]: createHeartsArt(3),
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

const getArtFromEffect = (item: Item): ItemArt =>
  match(item.effect)
    .with({ kind: 'HEART' }, ({ amount }) => createHeartsArt(amount))
    .with({ kind: 'STAR' }, ({ amount }) => createStarsArt(amount))
    .with({ kind: 'BULLET' }, ({ amount }) => createBulletsArt(amount))
    .with({ kind: 'FIREBALL' }, ({ amount }) => createFireballsArt(amount))
    .with({ kind: 'WARD' }, ({ hazard }) => createWardArt(hazard))
    .otherwise(() => createGemArt(RED_GEM_COLORS));

export const getItemArt = (item: Item): ItemArt =>
  ART_BY_ITEM_ID[item.id] ?? getArtFromEffect(item);
