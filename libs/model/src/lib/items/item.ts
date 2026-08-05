import type { ItemArt } from './item-art';
import type { ItemEffect } from './item-effect';
import type { ItemRarity } from './item-rarity';

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  art: ItemArt;
  effect: ItemEffect;
}
