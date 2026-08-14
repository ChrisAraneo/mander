import type { Item } from '../item';

export const TRIPLE_HEART: Item = {
  id: 'TRIPLE_HEART',
  name: 'Triple heart',
  description: 'Gives you three extra chances to survive',
  rarity: 'RARE',
  effect: { kind: 'HEART', amount: 3 },
};
