import type { Item } from '../item';

export const TWO_BULLETS: Item = {
  id: 'TWO_BULLETS',
  name: 'Two bullets',
  description: 'Two shots that drop any enemy (press X to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 2 },
};
