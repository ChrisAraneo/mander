import type { Random } from '@mander/common';
import type { Season } from '@mander/model';
import type { PaletteSky } from './palette-sky';

export interface PaletteSkyDraft {
  season: Season;
  sky: PaletteSky;
  random: Random;
}
