import type { Item } from '../item';

export const RED_GEM: Item = {
  id: 'RED_GEM',
  name: 'Red gem',
  description: '+1500 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 1500 },
};
