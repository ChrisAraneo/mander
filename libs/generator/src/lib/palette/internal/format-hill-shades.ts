import { formatHslCss, type Hsl } from '@mander/utils';

export const formatHillShades = ([far, near]: readonly [Hsl, Hsl]): readonly [
  string,
  string,
] => [formatHslCss(far), formatHslCss(near)];
