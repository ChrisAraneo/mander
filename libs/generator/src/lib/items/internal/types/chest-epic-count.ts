import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';

export interface ChestEpicCount {
  rarities: ItemRarity[];
  epics: number;
  random: ReturnType<typeof createRandom>;
}
