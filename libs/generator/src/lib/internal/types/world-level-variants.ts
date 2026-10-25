import type { Random } from '@mander/engine';
import type { Palette } from '@mander/render';
import type { LevelVariant } from '../../types/level-variant';

export interface WorldLevelVariants {
  name: string;
  palette: Palette;
  levelVariants: LevelVariant[];
  random: Random;
}
