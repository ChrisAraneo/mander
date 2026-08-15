import type { Item } from '../item';

export const TRIPLE_STAR: Item = {
  id: 'TRIPLE_STAR',
  name: 'Triple star',
  description: 'Grants temporary invincibility three times (press Z to use)',
  rarity: 'RARE',
  effect: { kind: 'STAR', amount: 3 },
};
