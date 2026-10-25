import { clamp } from 'lodash-es';
import { toWrappedHue } from './to-wrapped-hue';
import type { Hsl } from './types/hsl';

export const cloneShiftedHsl = (color: Hsl, delta: Partial<Hsl>): Hsl => ({
  hue: toWrappedHue(color.hue + (delta.hue ?? 0)),
  saturation: clamp(color.saturation + (delta.saturation ?? 0), 0, 100),
  lightness: clamp(color.lightness + (delta.lightness ?? 0), 0, 100),
});
