import {
  BLUE_DIAMOND,
  DOUBLE_HEART,
  GREEN_DIAMOND,
  HEART,
  type Item,
  PURPLE_DIAMOND,
  RED_DIAMOND,
  STAR,
  TRIPLE_HEART,
  YELLOW_DIAMOND,
} from '@mander/model';
import { match } from 'ts-pattern';

import {
  BLUE_GEM,
  type GemColors,
  GREEN_GEM,
  PURPLE_GEM,
  RED_GEM,
  YELLOW_GEM,
} from '../gem';
import { GOLD_STAR, type StarColors } from '../star';

export type ItemArt =
  | { kind: 'HEARTS'; count: number }
  | { kind: 'GEM'; colors: GemColors }
  | { kind: 'STAR'; colors: StarColors };

const gemArt = (colors: GemColors): ItemArt => ({ kind: 'GEM', colors });

const heartsArt = (count: number): ItemArt => ({ kind: 'HEARTS', count });

const starArt = (): ItemArt => ({ kind: 'STAR', colors: GOLD_STAR });

const ART_BY_ITEM_ID: Readonly<Partial<Record<string, ItemArt>>> =
  Object.freeze({
    [HEART.id]: heartsArt(1),
    [DOUBLE_HEART.id]: heartsArt(2),
    [TRIPLE_HEART.id]: heartsArt(3),
    [STAR.id]: starArt(),
    [RED_DIAMOND.id]: gemArt(RED_GEM),
    [GREEN_DIAMOND.id]: gemArt(GREEN_GEM),
    [YELLOW_DIAMOND.id]: gemArt(YELLOW_GEM),
    [BLUE_DIAMOND.id]: gemArt(BLUE_GEM),
    [PURPLE_DIAMOND.id]: gemArt(PURPLE_GEM),
  });

const artFromEffect = (item: Item): ItemArt =>
  match(item.effect)
    .with({ kind: 'HEART' }, ({ amount }) => heartsArt(amount))
    .with({ kind: 'STAR' }, () => starArt())
    .otherwise(() => gemArt(RED_GEM));

export const itemArt = (item: Item): ItemArt =>
  ART_BY_ITEM_ID[item.id] ?? artFromEffect(item);
