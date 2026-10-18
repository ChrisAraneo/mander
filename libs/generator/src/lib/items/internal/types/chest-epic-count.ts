import type { createRandom } from '@mander/engine';
import type { ItemRarity } from '@mander/model';

export interface ChestEpicCount {
  rarities: ItemRarity[];
  epics: number;
  random: ReturnType<typeof createRandom>;
}
