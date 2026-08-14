import type { Item } from '../item';

export const HEART: Item = {
  id: 'HEART',
  name: 'Extra life',
  description: 'Gives you extra chance to survive',
  rarity: 'COMMON',
  effect: { kind: 'HEART', amount: 1 },
};
