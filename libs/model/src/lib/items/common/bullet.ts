import type { Item } from '../item';

export const BULLET: Item = {
  id: 'BULLET',
  name: 'Bullet',
  description: 'One shot that drops any enemy (press M to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 1 },
};
