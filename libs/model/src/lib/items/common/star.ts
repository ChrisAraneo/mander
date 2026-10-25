import type { Item } from '../types/item';

export const STAR: Readonly<Item> = Object.freeze<Item>({
  id: 'STAR',
  name: 'Star',
  description: 'Grants temporary invincibility (press Z to use)',
  rarity: 'COMMON',
  effect: { kind: 'STAR', amount: 1 },
});
