import type { Palette } from '@mander/render';
import type { createRandom } from '@mander/utils';
import type { LevelCategory } from '../../world/types/level-category';

export interface WorldLevelCategories {
  name: string;
  palette: Palette;
  levelCategories: LevelCategory[];
  random: ReturnType<typeof createRandom>;
}
