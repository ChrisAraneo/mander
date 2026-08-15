import type { Item } from '../item';

export const MOON_MAGNET: Item = {
  id: 'MOON_MAGNET',
  name: 'Moon Magnet',
  description: 'Two moons circle you and burn the enemies they sweep through',
  rarity: 'EPIC',
  effect: { kind: 'FIREBALL', amount: 2 },
};
