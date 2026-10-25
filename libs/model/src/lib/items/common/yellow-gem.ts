import type { Item } from '../types/item';

export const YELLOW_GEM: Readonly<Item> = Object.freeze<Item>({
  id: 'YELLOW_GEM',
  name: 'Yellow gem',
  description: '+1750 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 1750 },
});
