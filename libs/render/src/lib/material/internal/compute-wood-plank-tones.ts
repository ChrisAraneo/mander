import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { cloneShiftedHsl } from '../../color/clone-shifted-hsl';
import { formatHslCss } from '../../color/format-hsl-css';
import { parseHsl } from '../../color/parse-hsl';

const PLANK_LIGHTNESS: readonly number[] = Object.freeze([0, -2, 4, -6, -1]);

export const computeWoodPlankTones = (base: string): string[] =>
  match(parseHsl(base))
    .with(undefined, () => map(PLANK_LIGHTNESS, () => base))
    .otherwise((color) =>
      map(PLANK_LIGHTNESS, (lightness) =>
        formatHslCss(cloneShiftedHsl(color, { lightness })),
      ),
    );
