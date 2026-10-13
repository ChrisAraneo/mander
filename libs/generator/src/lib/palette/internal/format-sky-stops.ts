import { formatHslCss, type Hsl } from '@mander/utils';

export const formatSkyStops = ([top, middle, horizon]: readonly [
  Hsl,
  Hsl,
  Hsl,
]): readonly [string, string, string] => [
  formatHslCss(top),
  formatHslCss(middle),
  formatHslCss(horizon),
];
