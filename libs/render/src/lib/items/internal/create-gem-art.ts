import type { GemColors } from '../../types/gem-colors';
import type { ItemArt } from '../types/item-art';

export const createGemArt = (colors: GemColors): ItemArt => ({
  kind: 'GEM',
  colors,
});
