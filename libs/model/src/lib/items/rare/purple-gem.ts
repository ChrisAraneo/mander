import type { Item } from '../types/item';

export const PURPLE_GEM: Readonly<Item> = Object.freeze<Item>({
  id: 'PURPLE_GEM',
  name: 'Purple gem',
  description: '+3000 points',
  rarity: 'RARE',
  effect: { kind: 'SCORE', amount: 3000 },
});
