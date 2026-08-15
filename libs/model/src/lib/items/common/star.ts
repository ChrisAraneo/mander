import type { Item } from '../item';

export const STAR: Item = {
  id: 'STAR',
  name: 'Star',
  description: 'Grants temporary invincibility (press Z to use)',
  rarity: 'COMMON',
  effect: { kind: 'STAR', amount: 1 },
};
