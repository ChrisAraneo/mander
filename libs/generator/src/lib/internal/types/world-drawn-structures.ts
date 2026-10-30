import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import type { Palette } from '@mander/render';
import type { LevelVariant } from '../../types/level-variant';
import type { LevelCategory } from '../../world/types/level-category';
import type { WorldStructures } from '../../world/types/world-structures';

export interface WorldDrawnStructures {
  name: string;
  season: Season;
  palette: Palette;
  levelVariants: LevelVariant[];
  levelCategories: LevelCategory[];
  worldStructures: WorldStructures;
  random: Random;
}
