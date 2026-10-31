import { type Random, takeRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING_CERAMIC_TONES: PaletteMaterialTone[] = [
  { hue: 148, saturation: 40, lightness: 48 },
  { hue: 158, saturation: 46, lightness: 46 },
  { hue: 166, saturation: 38, lightness: 52 },
  { hue: 174, saturation: 50, lightness: 44 },
  { hue: 186, saturation: 52, lightness: 48 },
  { hue: 192, saturation: 44, lightness: 54 },
  { hue: 200, saturation: 50, lightness: 50 },
  { hue: 206, saturation: 58, lightness: 44 },
  { hue: 216, saturation: 52, lightness: 48 },
  { hue: 232, saturation: 44, lightness: 52 },
  { hue: 252, saturation: 36, lightness: 56 },
  { hue: 268, saturation: 42, lightness: 54 },
  { hue: 288, saturation: 44, lightness: 52 },
  { hue: 306, saturation: 46, lightness: 50 },
];

const AUTUMN_CERAMIC_TONES: PaletteMaterialTone[] = [
  { hue: 132, saturation: 32, lightness: 34 },
  { hue: 150, saturation: 34, lightness: 36 },
  { hue: 164, saturation: 38, lightness: 34 },
  { hue: 186, saturation: 44, lightness: 38 },
  { hue: 198, saturation: 46, lightness: 36 },
  { hue: 212, saturation: 40, lightness: 40 },
  { hue: 224, saturation: 52, lightness: 38 },
  { hue: 238, saturation: 38, lightness: 42 },
  { hue: 268, saturation: 34, lightness: 36 },
  { hue: 284, saturation: 40, lightness: 42 },
  { hue: 296, saturation: 36, lightness: 38 },
  { hue: 318, saturation: 42, lightness: 42 },
  { hue: 324, saturation: 52, lightness: 36 },
  { hue: 330, saturation: 38, lightness: 44 },
];

const WINTER_CERAMIC_TONES: PaletteMaterialTone[] = [
  { hue: 174, saturation: 44, lightness: 62 },
  { hue: 182, saturation: 48, lightness: 66 },
  { hue: 188, saturation: 52, lightness: 60 },
  { hue: 194, saturation: 46, lightness: 70 },
  { hue: 200, saturation: 54, lightness: 64 },
  { hue: 206, saturation: 42, lightness: 72 },
  { hue: 212, saturation: 50, lightness: 62 },
  { hue: 220, saturation: 56, lightness: 68 },
  { hue: 228, saturation: 44, lightness: 66 },
  { hue: 238, saturation: 48, lightness: 60 },
  { hue: 252, saturation: 40, lightness: 70 },
  { hue: 266, saturation: 46, lightness: 64 },
  { hue: 280, saturation: 42, lightness: 68 },
  { hue: 294, saturation: 38, lightness: 62 },
];

const CERAMIC_TONES: Readonly<Record<Season, PaletteMaterialTone[]>> =
  Object.freeze({
    SPRING: SPRING_CERAMIC_TONES,
    AUTUMN: AUTUMN_CERAMIC_TONES,
    WINTER: WINTER_CERAMIC_TONES,
  });

export const createRandomCeramic = (
  season: Season,
  random: Random,
): PaletteMaterialTone => ({ ...takeRandom(CERAMIC_TONES[season], random) });
