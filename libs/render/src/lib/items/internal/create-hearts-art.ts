import type { ItemArt } from '../types/item-art';

export const createHeartsArt = (count: number): ItemArt => ({
  kind: 'HEARTS',
  count,
});
