import type { Item } from '../item';

export const PURPLE_DIAMOND: Item = {
  id: 'PURPLE_DIAMOND',
  name: 'Purple diamond',
  description: '+3000 points',
  rarity: 'RARE',
  effect: { kind: 'SCORE', amount: 3000 },
};
