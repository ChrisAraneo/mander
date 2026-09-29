import type { Palette } from '@mander/render';
import { createRandom, formatHslCss, type Hsl, wrapHue } from '@mander/utils';
import { match } from 'ts-pattern';

import { CAP_HUES, GLOW_HUES, GROUND_HUES, SKY_HUES } from './cel-hues';

const SKY_SATURATION_MIN = 24;
const SKY_SATURATION_MAX = 38;
const SKY_TOP_LIGHTNESS_MIN = 26;
const SKY_TOP_LIGHTNESS_MAX = 34;
const SKY_MIDDLE_LIGHTNESS_GAIN = 16;
const SKY_HORIZON_LIGHTNESS_GAIN = 30;
const SKY_HAZE_SATURATION_RATIO = 0.8;

const GLOW_SATURATION_MIN = 44;
const GLOW_SATURATION_MAX = 60;

const HILL_SATURATION_DROP = 6;
const FAR_HILL_LIGHTNESS_GAIN = 10;
const NEAR_HILL_LIGHTNESS_GAIN = 4;

const GROUND_SATURATION_MIN = 18;
const GROUND_SATURATION_MAX = 30;
const GROUND_LIGHTNESS_MIN = 28;
const GROUND_LIGHTNESS_MAX = 36;

const CAP_SATURATION_MIN = 34;
const CAP_SATURATION_MAX = 50;
const CAP_LIGHTNESS_MIN = 44;
const CAP_LIGHTNESS_MAX = 54;
const CAP_HIGHLIGHT_SATURATION_GAIN = 4;
const CAP_HIGHLIGHT_LIGHTNESS_GAIN = 6;

const ENTITY_HUE = 24;
const ENTITY_HUE_GUARD = 30;

interface Sky {
  hue: number;
  glowHue: number;
  saturation: number;
  glowSaturation: number;
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

const pushAwayFromEntityHue = (hue: number): number =>
  match(wrapHue(hue - ENTITY_HUE))
    .when(
      (gap) => gap >= ENTITY_HUE_GUARD && gap <= 360 - ENTITY_HUE_GUARD,
      () => hue,
    )
    .when(
      (gap) => gap <= 180,
      () => wrapHue(ENTITY_HUE + ENTITY_HUE_GUARD),
    )
    .otherwise(() => wrapHue(ENTITY_HUE - ENTITY_HUE_GUARD));

const rollSky = (random: ReturnType<typeof createRandom>): Sky => ({
  hue: random.pick(SKY_HUES),
  glowHue: random.pick(GLOW_HUES),
  saturation: random.rollInt(SKY_SATURATION_MIN, SKY_SATURATION_MAX),
  glowSaturation: random.rollInt(GLOW_SATURATION_MIN, GLOW_SATURATION_MAX),
  topLightness: random.rollInt(SKY_TOP_LIGHTNESS_MIN, SKY_TOP_LIGHTNESS_MAX),
});

const rollGround = (random: ReturnType<typeof createRandom>): Ground => {
  const hue = random.pick(GROUND_HUES);

  return {
    hue,
    saturation: random.rollInt(GROUND_SATURATION_MIN, GROUND_SATURATION_MAX),
    lightness: random.rollInt(GROUND_LIGHTNESS_MIN, GROUND_LIGHTNESS_MAX),
    capHue: pushAwayFromEntityHue(wrapHue(random.pick(CAP_HUES))),
    capSaturation: random.rollInt(CAP_SATURATION_MIN, CAP_SATURATION_MAX),
    capLightness: random.rollInt(CAP_LIGHTNESS_MIN, CAP_LIGHTNESS_MAX),
  };
};

const getSkyStops = (sky: Sky): readonly [Hsl, Hsl, Hsl] => [
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

const getHillShades = (sky: Sky): readonly [Hsl, Hsl] => [
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

export const generatePalette = (seed: string): Palette => {
  const random = createRandom(seed);
  const sky = rollSky(random);
  const ground = rollGround(random);
  const [top, middle, horizon] = getSkyStops(sky);
  const [far, near] = getHillShades(sky);

  return {
    sky: [formatHslCss(top), formatHslCss(middle), formatHslCss(horizon)],
    hills: [formatHslCss(far), formatHslCss(near)],
    block: formatHslCss({
      hue: ground.hue,
      saturation: ground.saturation,
      lightness: ground.lightness,
    }),
    blockCap: formatHslCss({
      hue: ground.capHue,
      saturation: ground.capSaturation,
      lightness: ground.capLightness,
    }),
    blockCapHighlight: formatHslCss({
      hue: ground.capHue,
      saturation: ground.capSaturation + CAP_HIGHLIGHT_SATURATION_GAIN,
      lightness: ground.capLightness + CAP_HIGHLIGHT_LIGHTNESS_GAIN,
    }),
  };
};
