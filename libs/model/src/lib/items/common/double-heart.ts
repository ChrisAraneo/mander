import type { Item } from '../types/item';

export const DOUBLE_HEART: Readonly<Item> = Object.freeze<Item>({
  id: 'DOUBLE_HEART',
  name: 'Double heart',
  description: 'Gives you two extra chances to survive',
  rarity: 'COMMON',
  effect: { kind: 'HEART', amount: 2 },
});
