import type { Item } from '../types/item';

export const TWO_BULLETS: Readonly<Item> = Object.freeze<Item>({
  id: 'TWO_BULLETS',
  name: 'Four bullets',
  description: 'Four shots that drop any enemy or spike (press X to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 4 },
});
