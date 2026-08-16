import { round } from 'lodash-es';

import type { Hsl } from './hsl.ts';

export const hslCss = (color: Hsl): string =>
  `HSL(${round(color.hue)}, ${round(color.saturation)}%, ${round(color.lightness)}%)`;
