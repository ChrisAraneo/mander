import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import type { Palette } from '@mander/render';

export interface WorldPalette {
  name: string;
  season: Season;
  palette: Palette;
  random: Random;
}
