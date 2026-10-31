import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import type { PaletteGround } from './palette-ground';
import type { PaletteSky } from './palette-sky';

export interface PaletteGroundDraft {
  season: Season;
  sky: PaletteSky;
  ground: PaletteGround;
  random: Random;
}
