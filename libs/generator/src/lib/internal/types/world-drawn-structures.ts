import type { createRandom } from '@mander/engine';
import type { Palette } from '@mander/render';
import type { LevelVariant } from '../../types/level-variant';
import type { LevelCategory } from '../../world/types/level-category';
import type { WorldStructures } from '../../world/types/world-structures';

export interface WorldDrawnStructures {
  name: string;
  palette: Palette;
  levelVariants: LevelVariant[];
  levelCategories: LevelCategory[];
  worldStructures: WorldStructures;
  random: ReturnType<typeof createRandom>;
}
