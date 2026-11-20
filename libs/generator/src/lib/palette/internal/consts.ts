import type { Season } from '@mander/model';
import type { PaletteGroundShades } from './types/palette-ground-shades';

const SPRING_GROUND_SHADES: PaletteGroundShades = {
  saturation: { min: 18, max: 30 },
  lightness: { min: 28, max: 36 },
  capSaturation: { min: 34, max: 50 },
  capLightness: { min: 44, max: 54 },
};

const SUMMER_GROUND_SHADES: PaletteGroundShades = {
  saturation: { min: 40, max: 56 },
  lightness: { min: 38, max: 48 },
  capSaturation: { min: 56, max: 72 },
  capLightness: { min: 56, max: 66 },
};

const AUTUMN_GROUND_SHADES: PaletteGroundShades = {
  saturation: { min: 0, max: 30 },
  lightness: { min: 14, max: 36 },
  capSaturation: { min: 0, max: 50 },
  capLightness: { min: 38, max: 54 },
};

const WINTER_GROUND_SHADES: PaletteGroundShades = {
  saturation: { min: 14, max: 24 },
  lightness: { min: 30, max: 38 },
  capSaturation: { min: 12, max: 24 },
  capLightness: { min: 74, max: 84 },
};

export const GROUND_SHADES: Readonly<Record<Season, PaletteGroundShades>> =
  Object.freeze({
    SPRING: SPRING_GROUND_SHADES,
    SUMMER: SUMMER_GROUND_SHADES,
    AUTUMN: AUTUMN_GROUND_SHADES,
    WINTER: WINTER_GROUND_SHADES,
  });
