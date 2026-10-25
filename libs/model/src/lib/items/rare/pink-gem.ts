import type { Item } from '../types/item';

export const PINK_GEM: Readonly<Item> = Object.freeze<Item>({
  id: 'PINK_GEM',
  name: 'Pink gem',
  description: '+2750 points',
  rarity: 'RARE',
  effect: { kind: 'SCORE', amount: 2750 },
});
