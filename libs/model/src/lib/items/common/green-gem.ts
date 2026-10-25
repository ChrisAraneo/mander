import type { Item } from '../types/item';

export const GREEN_GEM: Readonly<Item> = Object.freeze<Item>({
  id: 'GREEN_GEM',
  name: 'Green gem',
  description: '+2000 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 2000 },
});
