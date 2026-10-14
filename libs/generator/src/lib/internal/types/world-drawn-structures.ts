import type { Palette } from '@mander/render';
import type { createRandom } from '@mander/utils';
import type { LevelCategory } from '../../world/types/level-category';
import type { WorldStructures } from '../../world/types/world-structures';

export interface WorldDrawnStructures {
  name: string;
  palette: Palette;
  levelCategories: LevelCategory[];
  worldStructures: WorldStructures;
  random: ReturnType<typeof createRandom>;
}
