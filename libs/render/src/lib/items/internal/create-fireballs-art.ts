import type { ItemArt } from '../types/item-art';

export const createFireballsArt = (count: number): ItemArt => ({
  kind: 'FIREBALLS',
  count,
});
