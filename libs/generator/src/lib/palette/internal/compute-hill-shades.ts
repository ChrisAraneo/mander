import type { Hsl } from '@mander/render';
import type { PaletteSky } from './types/palette-sky';

const HILL_SATURATION_DROP = 6;

const FAR_HILL_LIGHTNESS_GAIN = 10;

const NEAR_HILL_LIGHTNESS_GAIN = 4;

export const computeHillShades = (sky: PaletteSky): readonly [Hsl, Hsl] => [
  {
    hue: sky.hue,
    saturation: sky.saturation - HILL_SATURATION_DROP,
    lightness: sky.topLightness + FAR_HILL_LIGHTNESS_GAIN,
  },
  {
    hue: sky.hue,
    saturation: sky.saturation - HILL_SATURATION_DROP,
    lightness: sky.topLightness + NEAR_HILL_LIGHTNESS_GAIN,
  },
];
