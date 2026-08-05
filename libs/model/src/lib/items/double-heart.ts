import type { Item } from './item';

export const DOUBLE_HEART: Item = {
  id: 'DOUBLE_HEART',
  name: 'Double heart',
  description: 'Gives you two extra chances to survive',
  rarity: 'RARE',
  art: 'DOUBLE_HEART',
  effect: { kind: 'HEART', amount: 2 },
};
