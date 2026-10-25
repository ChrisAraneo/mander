import type { Item } from '../types/item';

export const HEART: Readonly<Item> = Object.freeze<Item>({
  id: 'HEART',
  name: 'Extra life',
  description: 'Gives you extra chance to survive',
  rarity: 'COMMON',
  effect: { kind: 'HEART', amount: 1 },
});
