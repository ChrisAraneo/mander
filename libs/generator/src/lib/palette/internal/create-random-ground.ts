import { type Random, takeRandom, createRandomInt } from '@mander/engine';
import type { Season } from '@mander/model';
import { toWrappedHue } from '@mander/render';
import { pipe } from 'remeda';
import { computeHueAwayFromEntity } from './compute-hue-away-from-entity';
import type { PaletteGround } from './types/palette-ground';
import type { PaletteGroundShades } from './types/palette-ground-shades';
import type { PaletteShadeRange } from './types/palette-shade-range';

const SPRING_GROUND_HUES = [
  50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 112, 120, 128, 136, 144, 152,
];

const SPRING_CAP_HUES = [
  58, 64, 70, 76, 82, 88, 94, 100, 108, 116, 124, 132, 140, 148,
];

const AUTUMN_GROUND_HUES = [344, 350, 356, 2, 8, 14, 20, 26, 32, 38, 44, 50];

const AUTUMN_CAP_HUES = [56, 60, 64, 68, 336, 342, 348, 352];

const WINTER_GROUND_HUES = [
  186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 248, 256, 264, 272, 282,
  292,
];

const WINTER_CAP_HUES = [
  186, 192, 198, 204, 210, 216, 222, 228, 236, 244, 252, 264, 276, 288,
];

const GROUND_HUES: Readonly<Record<Season, number[]>> = Object.freeze({
  SPRING: SPRING_GROUND_HUES,
  AUTUMN: AUTUMN_GROUND_HUES,
  WINTER: WINTER_GROUND_HUES,
});

const CAP_HUES: Readonly<Record<Season, number[]>> = Object.freeze({
  SPRING: SPRING_CAP_HUES,
  AUTUMN: AUTUMN_CAP_HUES,
  WINTER: WINTER_CAP_HUES,
});

const TEMPERATE_GROUND_SHADES: PaletteGroundShades = {
  saturation: { min: 18, max: 30 },
  lightness: { min: 28, max: 36 },
  capSaturation: { min: 34, max: 50 },
  capLightness: { min: 44, max: 54 },
};

const FROZEN_GROUND_SHADES: PaletteGroundShades = {
  saturation: { min: 14, max: 24 },
  lightness: { min: 30, max: 38 },
  capSaturation: { min: 12, max: 24 },
  capLightness: { min: 74, max: 84 },
};

const GROUND_SHADES: Readonly<Record<Season, PaletteGroundShades>> =
  Object.freeze({
    SPRING: TEMPERATE_GROUND_SHADES,
    AUTUMN: TEMPERATE_GROUND_SHADES,
    WINTER: FROZEN_GROUND_SHADES,
  });

const createRandomShade = (
  { min, max }: PaletteShadeRange,
  random: Random,
): number => createRandomInt(min, max, random);

export const createRandomGround = (
  season: Season,
  random: Random,
): PaletteGround =>
  pipe(GROUND_SHADES[season], (shades) => ({
    hue: takeRandom(GROUND_HUES[season], random),
    saturation: createRandomShade(shades.saturation, random),
    lightness: createRandomShade(shades.lightness, random),
    capHue: computeHueAwayFromEntity(
      toWrappedHue(takeRandom(CAP_HUES[season], random)),
    ),
    capSaturation: createRandomShade(shades.capSaturation, random),
    capLightness: createRandomShade(shades.capLightness, random),
  }));
