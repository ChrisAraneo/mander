import { formatHslCss } from '@mander/render';
import type { SkyStops } from './types/sky-stops';

export const formatSkyStops = ([top, middle, horizon]: SkyStops): readonly [
  string,
  string,
  string,
] => [formatHslCss(top), formatHslCss(middle), formatHslCss(horizon)];
