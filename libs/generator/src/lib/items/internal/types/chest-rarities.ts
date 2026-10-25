import type { Random } from '@mander/engine';
import type { ItemRarity } from '@mander/model';

export interface ChestRarities {
  rarities: ItemRarity[];
  random: Random;
}
