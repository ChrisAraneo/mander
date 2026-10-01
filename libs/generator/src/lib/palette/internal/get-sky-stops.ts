import type { Hsl } from '@mander/utils';
import type { Sky } from './sky';

const SKY_MIDDLE_LIGHTNESS_GAIN = 16;

const SKY_HORIZON_LIGHTNESS_GAIN = 30;

const SKY_HAZE_SATURATION_RATIO = 0.8;

export const getSkyStops = (sky: Sky): readonly [Hsl, Hsl, Hsl] => [
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
