import type { Item } from '../types/item';

export const TRIPLE_HEART: Readonly<Item> = Object.freeze<Item>({
  id: 'TRIPLE_HEART',
  name: 'Triple heart',
  description: 'Gives you three extra chances to survive',
  rarity: 'RARE',
  effect: { kind: 'HEART', amount: 3 },
});
