import { clamp } from 'lodash-es';

import type { Hsl } from './hsl';
import { wrapHue } from './wrap-hue';

/**
 * Moves a colour by a delta: the hue travels round the wheel, saturation and
 * lightness stop at the ends rather than wrapping.
 */
export const shiftHsl = (color: Hsl, delta: Partial<Hsl>): Hsl => ({
  hue: wrapHue(color.hue + (delta.hue ?? 0)),
  saturation: clamp(color.saturation + (delta.saturation ?? 0), 0, 100),
  lightness: clamp(color.lightness + (delta.lightness ?? 0), 0, 100),
});
