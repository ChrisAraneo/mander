import type { Item } from './item';

export const RED_DIAMOND: Item = {
  id: 'RED_DIAMOND',
  name: 'Red diamond',
  description: 'Worth 2 500 points on the spot',
  rarity: 'COMMON',
  art: 'GEM',
  effect: { kind: 'SCORE', amount: 2500 },
};
