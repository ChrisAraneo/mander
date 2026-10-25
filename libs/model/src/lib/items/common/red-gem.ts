import type { Item } from '../types/item';

export const RED_GEM: Readonly<Item> = Object.freeze<Item>({
  id: 'RED_GEM',
  name: 'Red gem',
  description: '+1500 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 1500 },
});
