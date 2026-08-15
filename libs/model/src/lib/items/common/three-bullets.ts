import type { Item } from '../item';

export const THREE_BULLETS: Item = {
  id: 'THREE_BULLETS',
  name: 'Three bullets',
  description: 'Three shots that drop any enemy (press X to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 3 },
};
