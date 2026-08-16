import { match } from 'ts-pattern';
import { constant } from 'lodash-es';

import type { Hsl } from './hsl';

const HSL_PATTERN =
  /^hsl\(\s*(?<hue>-?[\d.]+)\s*,\s*(?<saturation>[\d.]+)%\s*,\s*(?<lightness>[\d.]+)%\s*\)$/iu;

export const parseHsl = (color: string): Hsl | undefined =>
  match(HSL_PATTERN.exec(color)?.groups)
    .with(undefined, constant(undefined))
    .otherwise((groups) => ({
      hue: Number(groups.hue),
      saturation: Number(groups.saturation),
      lightness: Number(groups.lightness),
    }));
