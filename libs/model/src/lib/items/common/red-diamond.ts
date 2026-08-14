import type { Item } from '../item';

export const RED_DIAMOND: Item = {
  id: 'RED_DIAMOND',
  name: 'Red diamond',
  description: '+1500 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 1500 },
};
