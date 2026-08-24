import type { Item } from '../item';

export const YELLOW_GEM: Item = {
  id: 'YELLOW_GEM',
  name: 'Yellow gem',
  description: '+1750 points',
  rarity: 'COMMON',
  effect: { kind: 'SCORE', amount: 1750 },
};
