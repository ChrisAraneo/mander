import type { Random } from '@mander/common';
import type { ItemRarity } from '@mander/model';

export interface ChestRarities {
  rarities: ItemRarity[];
  random: Random;
}
