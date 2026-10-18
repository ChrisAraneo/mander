import { round } from 'lodash-es';
import type { Hsl } from './types/hsl';

export const formatHslCss = (color: Hsl): string =>
  `HSL(${round(color.hue)}, ${round(color.saturation)}%, ${round(color.lightness)}%)`;
