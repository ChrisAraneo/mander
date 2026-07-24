import type { Rng } from '../rng';
import { awayFromEntityHue } from './away-from-entity-hue';
import {
  CAP_HIGHLIGHT_LIGHTNESS_GAIN,
  CAP_HIGHLIGHT_SATURATION_GAIN,
  CAP_HUE_OFFSET_MAX,
  CAP_HUE_OFFSET_MIN,
  CAP_LIGHTNESS_MAX,
  CAP_LIGHTNESS_MIN,
  CAP_SATURATION_MAX,
  CAP_SATURATION_MIN,
  FAR_HILL_LIGHTNESS_GAIN,
  GROUND_LIGHTNESS_MAX,
  GROUND_LIGHTNESS_MIN,
  GROUND_SATURATION_MAX,
  GROUND_SATURATION_MIN,
  HILL_SATURATION_DROP,
  HUE_MAX,
  NEAR_HILL_LIGHTNESS_GAIN,
  SKY_HORIZON_HUE_DRIFT,
  SKY_HORIZON_LIGHTNESS_GAIN,
  SKY_MIDDLE_LIGHTNESS_GAIN,
  SKY_SATURATION_MAX,
  SKY_SATURATION_MIN,
  SKY_TOP_LIGHTNESS_MAX,
  SKY_TOP_LIGHTNESS_MIN,
} from './constants';
import type { Hsl } from './hsl';
import { hslCss } from './hsl-css';
import type { Palette } from './palette';
import { wrapHue } from './wrap-hue';

interface Sky {
  hue: number;
  horizonHue: number;
  saturation: number;
  topLightness: number;
}

interface Ground {
  hue: number;
  saturation: number;
  lightness: number;
  capHue: number;
  capSaturation: number;
  capLightness: number;
}

const rollSky = (rng: Rng): Sky => {
  const hue = rng.int(0, HUE_MAX);
  return {
    hue,
    horizonHue: wrapHue(
      hue + rng.int(-SKY_HORIZON_HUE_DRIFT, SKY_HORIZON_HUE_DRIFT),
    ),
    saturation: rng.int(SKY_SATURATION_MIN, SKY_SATURATION_MAX),
    topLightness: rng.int(SKY_TOP_LIGHTNESS_MIN, SKY_TOP_LIGHTNESS_MAX),
  };
};

const rollGround = (rng: Rng): Ground => {
  const hue = rng.int(0, HUE_MAX);
  return {
    hue,
    saturation: rng.int(GROUND_SATURATION_MIN, GROUND_SATURATION_MAX),
    lightness: rng.int(GROUND_LIGHTNESS_MIN, GROUND_LIGHTNESS_MAX),
    capHue: awayFromEntityHue(
      wrapHue(hue + rng.int(CAP_HUE_OFFSET_MIN, CAP_HUE_OFFSET_MAX)),
    ),
    capSaturation: rng.int(CAP_SATURATION_MIN, CAP_SATURATION_MAX),
    capLightness: rng.int(CAP_LIGHTNESS_MIN, CAP_LIGHTNESS_MAX),
  };
};

const skyColors = (sky: Sky): Hsl[] => [
  { hue: sky.hue, saturation: sky.saturation, lightness: sky.topLightness },
  {
    hue: sky.hue,
    saturation: sky.saturation,
    lightness: sky.topLightness + SKY_MIDDLE_LIGHTNESS_GAIN,
  },
  {
    hue: sky.horizonHue,
    saturation: sky.saturation,
    lightness: sky.topLightness + SKY_HORIZON_LIGHTNESS_GAIN,
  },
];

const hillColors = (sky: Sky): Hsl[] => [
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

export const rollPalette = (rng: Rng): Palette => {
  const sky = rollSky(rng);
  const ground = rollGround(rng);
  const [top, middle, horizon] = skyColors(sky);
  const [far, near] = hillColors(sky);

  return {
    sky: [hslCss(top), hslCss(middle), hslCss(horizon)],
    hills: [hslCss(far), hslCss(near)],
    block: hslCss({
      hue: ground.hue,
      saturation: ground.saturation,
      lightness: ground.lightness,
    }),
    blockCap: hslCss({
      hue: ground.capHue,
      saturation: ground.capSaturation,
      lightness: ground.capLightness,
    }),
    blockCapHighlight: hslCss({
      hue: ground.capHue,
      saturation: ground.capSaturation + CAP_HIGHLIGHT_SATURATION_GAIN,
      lightness: ground.capLightness + CAP_HIGHLIGHT_LIGHTNESS_GAIN,
    }),
  };
};
