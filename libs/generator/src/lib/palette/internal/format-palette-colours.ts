import { type Hsl, type Palette, formatHslCss } from '@mander/render';
import { computeHillShades } from './compute-hill-shades';
import { computeSkyStops } from './compute-sky-stops';
import { formatHillShades } from './format-hill-shades';
import { formatPaletteMaterials } from './format-palette-materials';
import { formatSkyStops } from './format-sky-stops';
import type { PaletteDraft } from './types/palette-draft';
import type { PaletteGround } from './types/palette-ground';

const CAP_HIGHLIGHT_SATURATION_GAIN = 4;

const CAP_HIGHLIGHT_LIGHTNESS_GAIN = 6;

const computeCapHighlight = ({
  capHue,
  capSaturation,
  capLightness,
}: PaletteGround): Hsl => ({
  hue: capHue,
  saturation: capSaturation + CAP_HIGHLIGHT_SATURATION_GAIN,
  lightness: capLightness + CAP_HIGHLIGHT_LIGHTNESS_GAIN,
});

export const formatPaletteColours = ({
  sky,
  ground,
  materials,
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
  blockCapHighlight: formatHslCss(computeCapHighlight(ground)),
  materials: formatPaletteMaterials(materials),
});
