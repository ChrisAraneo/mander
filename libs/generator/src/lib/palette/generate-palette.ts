import type { Palette } from '@mander/render';
import { type createRandom, formatHslCss } from '@mander/utils';
import { getHillShades } from './internal/get-hill-shades';
import { getSkyStops } from './internal/get-sky-stops';
import { rollGround } from './internal/roll-ground';
import { rollSky } from './internal/roll-sky';

const CAP_HIGHLIGHT_SATURATION_GAIN = 4;

const CAP_HIGHLIGHT_LIGHTNESS_GAIN = 6;

export const generatePalette = (
  random: ReturnType<typeof createRandom>,
): Palette => {
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
