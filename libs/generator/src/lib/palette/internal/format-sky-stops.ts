import { formatHslCss, type Hsl } from '@mander/render';

export const formatSkyStops = ([top, middle, horizon]: readonly [
  Hsl,
  Hsl,
  Hsl,
]): readonly [string, string, string] => [
  formatHslCss(top),
  formatHslCss(middle),
  formatHslCss(horizon),
];
