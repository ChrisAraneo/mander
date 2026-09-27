import type { Item } from '../item';

export const THREE_BULLETS: Item = {
  id: 'THREE_BULLETS',
  name: 'Six bullets',
  description: 'Six shots that drop any enemy or spike (press X to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 6 },
};
