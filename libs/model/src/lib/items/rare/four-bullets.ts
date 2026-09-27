import type { Item } from '../item';

export const FOUR_BULLETS: Item = {
  id: 'FOUR_BULLETS',
  name: 'Eight bullets',
  description: 'Eight shots that drop any enemy or spike (press X to fire)',
  rarity: 'RARE',
  effect: { kind: 'BULLET', amount: 8 },
};
