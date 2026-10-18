import type { Hsl } from '@mander/render';
import type { PaletteSky } from './types/palette-sky';

const SKY_MIDDLE_LIGHTNESS_GAIN = 16;

const SKY_HORIZON_LIGHTNESS_GAIN = 30;

const SKY_HAZE_SATURATION_RATIO = 0.8;

export const computeSkyStops = (sky: PaletteSky): readonly [Hsl, Hsl, Hsl] => [
  { hue: sky.hue, saturation: sky.saturation, lightness: sky.topLightness },
  {
    hue: sky.glowHue,
    saturation: sky.saturation * SKY_HAZE_SATURATION_RATIO,
    lightness: sky.topLightness + SKY_MIDDLE_LIGHTNESS_GAIN,
  },
  {
    hue: sky.glowHue,
    saturation: sky.glowSaturation,
    lightness: sky.topLightness + SKY_HORIZON_LIGHTNESS_GAIN,
  },
];
