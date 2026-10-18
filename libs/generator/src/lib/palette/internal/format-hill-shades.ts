import { formatHslCss, type Hsl } from '@mander/render';

export const formatHillShades = ([far, near]: readonly [Hsl, Hsl]): readonly [
  string,
  string,
] => [formatHslCss(far), formatHslCss(near)];
