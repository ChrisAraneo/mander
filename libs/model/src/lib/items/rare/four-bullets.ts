import type { Item } from '../item';

export const FOUR_BULLETS: Item = {
  id: 'FOUR_BULLETS',
  name: 'Four bullets',
  description: 'Four shots that drop any enemy (press X to fire)',
  rarity: 'RARE',
  effect: { kind: 'BULLET', amount: 4 },
};
