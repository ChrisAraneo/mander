import type { Item } from '../types/item';

export const DOUBLE_STAR: Readonly<Item> = Object.freeze<Item>({
  id: 'DOUBLE_STAR',
  name: 'Double star',
  description: 'Grants temporary invincibility twice (press Z to use)',
  rarity: 'COMMON',
  effect: { kind: 'STAR', amount: 2 },
});
