import type { ItemArt } from '../types/item-art';

export const createCountedArt = (
  kind: 'HEARTS' | 'BULLETS' | 'FIREBALLS',
  count: number,
): ItemArt => ({ kind, count });
