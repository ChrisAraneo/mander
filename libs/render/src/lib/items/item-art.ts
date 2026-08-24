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

const gemArt = (colors: GemColors): ItemArt => ({ kind: 'GEM', colors });

const heartsArt = (count: number): ItemArt => ({ kind: 'HEARTS', count });

const starsArt = (count: number): ItemArt => ({
  kind: 'STARS',
  count,
  colors: GOLD_STAR,
});

const bulletsArt = (count: number): ItemArt => ({ kind: 'BULLETS', count });

const fireballsArt = (count: number): ItemArt => ({ kind: 'FIREBALLS', count });

const wardArt = (hazard: HazardKind): ItemArt =>
  match(hazard)
    .with('CEILING_SPIKE', (): ItemArt => ({ kind: 'HELMET' }))
    .otherwise((): ItemArt => ({ kind: 'BOOTS' }));

const ART_BY_ITEM_ID: Readonly<Partial<Record<string, ItemArt>>> =
  Object.freeze({
    [HEART.id]: heartsArt(1),
    [DOUBLE_HEART.id]: heartsArt(2),
    [TRIPLE_HEART.id]: heartsArt(3),
    [STAR.id]: starsArt(1),
    [DOUBLE_STAR.id]: starsArt(2),
    [RED_GEM.id]: gemArt(RED_GEM_COLORS),
    [GREEN_GEM.id]: gemArt(GREEN_GEM_COLORS),
    [YELLOW_GEM.id]: gemArt(YELLOW_GEM_COLORS),
    [BLUE_GEM.id]: gemArt(BLUE_GEM_COLORS),
    [PURPLE_GEM.id]: gemArt(PURPLE_GEM_COLORS),
    [PINK_GEM.id]: gemArt(PINK_GEM_COLORS),
    [BOOTS_OF_CLOUDS.id]: { kind: 'BOOTS' },
    [TITANIUM_HELMET.id]: { kind: 'HELMET' },
  });

const artFromEffect = (item: Item): ItemArt =>
  match(item.effect)
    .with({ kind: 'HEART' }, ({ amount }) => heartsArt(amount))
    .with({ kind: 'STAR' }, ({ amount }) => starsArt(amount))
    .with({ kind: 'BULLET' }, ({ amount }) => bulletsArt(amount))
    .with({ kind: 'FIREBALL' }, ({ amount }) => fireballsArt(amount))
    .with({ kind: 'WARD' }, ({ hazard }) => wardArt(hazard))
    .otherwise(() => gemArt(RED_GEM_COLORS));

export const itemArt = (item: Item): ItemArt =>
  ART_BY_ITEM_ID[item.id] ?? artFromEffect(item);
