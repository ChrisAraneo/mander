import type { ItemArt } from '../types/item-art';

export const createBulletsArt = (count: number): ItemArt => ({
  kind: 'BULLETS',
  count,
});
