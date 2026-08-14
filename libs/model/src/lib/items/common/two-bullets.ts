import type { Item } from '../item';

export const TWO_BULLETS: Item = {
  id: 'TWO_BULLETS',
  name: 'Two bullets',
  description: 'Two shots that drop any enemy (press M to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 2 },
};
