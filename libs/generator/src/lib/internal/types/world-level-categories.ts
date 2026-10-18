import type { createRandom } from '@mander/engine';
import type { Palette } from '@mander/render';
import type { LevelCategory } from '../../world/types/level-category';

export interface WorldLevelCategories {
  name: string;
  palette: Palette;
  levelCategories: LevelCategory[];
  random: ReturnType<typeof createRandom>;
}
