import type { Item } from '../item';

export const PURPLE_GEM: Item = {
  id: 'PURPLE_GEM',
  name: 'Purple gem',
  description: '+3000 points',
  rarity: 'RARE',
  effect: { kind: 'SCORE', amount: 3000 },
};
