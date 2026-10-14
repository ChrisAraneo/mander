import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';

export interface ChestRarities {
  rarities: ItemRarity[];
  random: ReturnType<typeof createRandom>;
}
