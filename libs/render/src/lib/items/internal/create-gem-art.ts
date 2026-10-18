import type { ShadeColors } from '../../types/shade-colors';
import type { ItemArt } from '../types/item-art';

export const createGemArt = (colors: ShadeColors): ItemArt => ({
  kind: 'GEM',
  colors,
});
