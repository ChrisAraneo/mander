import type { Item } from '../types/item';

export const THREE_BULLETS: Readonly<Item> = Object.freeze<Item>({
  id: 'THREE_BULLETS',
  name: 'Six bullets',
  description: 'Six shots that drop any enemy or spike (press X to fire)',
  rarity: 'COMMON',
  effect: { kind: 'BULLET', amount: 6 },
});
