import type { Palette } from '@mander/render';
import { formatHslCss } from '@mander/utils';
import { computeHillShades } from './compute-hill-shades';
import { computeSkyStops } from './compute-sky-stops';
import { formatHillShades } from './format-hill-shades';
import { formatSkyStops } from './format-sky-stops';
import type { PaletteDraft } from './types/palette-draft';

const CAP_HIGHLIGHT_SATURATION_GAIN = 4;

const CAP_HIGHLIGHT_LIGHTNESS_GAIN = 6;

export const formatPaletteColours = ({
  sky,
  ground,
}: PaletteDraft): Palette => ({
  sky: formatSkyStops(computeSkyStops(sky)),
  hills: formatHillShades(computeHillShades(sky)),
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
});
