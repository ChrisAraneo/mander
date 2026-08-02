import { match } from 'ts-pattern';

import type { Hsl } from './hsl';

const HSL_PATTERN =
  /^hsl\(\s*(?<hue>-?[\d.]+)\s*,\s*(?<saturation>[\d.]+)%\s*,\s*(?<lightness>[\d.]+)%\s*\)$/iu;

/**
 * Reads a colour back out of the `HSL(h, s%, l%)` form the palette is written
 * in. Anything else — a hex literal, a blank from a level with no palette —
 * comes back undefined, so callers can fall back rather than guess.
 */
export const parseHsl = (color: string): Hsl | undefined =>
  match(HSL_PATTERN.exec(color)?.groups)
    .with(undefined, () => undefined)
    .otherwise((groups) => ({
      hue: Number(groups.hue),
      saturation: Number(groups.saturation),
      lightness: Number(groups.lightness),
    }));
