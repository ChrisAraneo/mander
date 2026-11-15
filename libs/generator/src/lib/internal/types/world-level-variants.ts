import type { Random } from '@mander/common';
import type { Season } from '@mander/model';
import type { Palette } from '@mander/render';
import type { LevelVariant } from '../../types/level-variant';

export interface WorldLevelVariants {
  name: string;
  season: Season;
  palette: Palette;
  levelVariants: LevelVariant[];
  random: Random;
}
