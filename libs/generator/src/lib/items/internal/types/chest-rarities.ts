import type { createRandom } from '@mander/engine';
import type { ItemRarity } from '@mander/model';

export interface ChestRarities {
  rarities: ItemRarity[];
  random: ReturnType<typeof createRandom>;
}
