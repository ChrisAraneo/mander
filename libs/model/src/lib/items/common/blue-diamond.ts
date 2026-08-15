import type { Item } from '../item';

export const BLUE_DIAMOND: Item = {
  id: 'BLUE_DIAMOND',
  name: 'Blue diamond',
  description: '+2250 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 2250 },
};
