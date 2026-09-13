import type { Item } from '../item';

export const BULLET: Item = {
  id: 'BULLET',
  name: 'Two bullets',
  description: 'Two shots that drop any enemy or spike (press X to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 2 },
};
