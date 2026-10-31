import type { PaletteGround } from './palette-ground';
import type { PaletteMaterialTones } from './palette-material-tones';
import type { PaletteSky } from './palette-sky';

export interface PaletteDraft {
  sky: PaletteSky;
  ground: PaletteGround;
  materials: PaletteMaterialTones;
}
