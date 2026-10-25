import type { Item } from '../types/item';

export const BULLET: Readonly<Item> = Object.freeze<Item>({
  id: 'BULLET',
  name: 'Two bullets',
  description: 'Two shots that drop any enemy or spike (press X to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 2 },
});
