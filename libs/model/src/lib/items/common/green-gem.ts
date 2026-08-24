import type { Item } from '../item';

export const GREEN_GEM: Item = {
  id: 'GREEN_GEM',
  name: 'Green gem',
  description: '+2000 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 2000 },
};
