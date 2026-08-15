import type { Item } from '../item';

export const GREEN_DIAMOND: Item = {
  id: 'GREEN_DIAMOND',
  name: 'Green diamond',
  description: '+2000 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 2000 },
};
