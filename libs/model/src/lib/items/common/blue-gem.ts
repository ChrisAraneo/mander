import type { Item } from '../types/item';

export const BLUE_GEM: Readonly<Item> = Object.freeze<Item>({
  id: 'BLUE_GEM',
  name: 'Blue gem',
  description: '+2250 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 2250 },
});
