import type { Item } from '../item';

export const BLUE_GEM: Item = {
  id: 'BLUE_GEM',
  name: 'Blue gem',
  description: '+2250 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 2250 },
};
