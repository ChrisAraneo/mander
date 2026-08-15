import type { Item } from '../item';

export const YELLOW_DIAMOND: Item = {
  id: 'YELLOW_DIAMOND',
  name: 'Yellow diamond',
  description: '+1750 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 1750 },
};
