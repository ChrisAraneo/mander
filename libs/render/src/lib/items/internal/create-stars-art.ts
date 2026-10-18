import { GOLD_STAR } from '../../star/consts';
import type { ItemArt } from '../types/item-art';

export const createStarsArt = (count: number): ItemArt => ({
  kind: 'STARS',
  count,
  colors: GOLD_STAR,
});
