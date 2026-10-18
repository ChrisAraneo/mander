import { formatHslCss, parseHsl, shiftHsl } from '@mander/utils';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

const PLANK_LIGHTNESS: readonly number[] = Object.freeze([0, -2, 4, -6, -1]);

export const computeWoodPlankTones = (base: string): string[] =>
  match(parseHsl(base))
    .with(undefined, () => map(PLANK_LIGHTNESS, () => base))
    .otherwise((color) =>
      map(PLANK_LIGHTNESS, (lightness) =>
        formatHslCss(shiftHsl(color, { lightness })),
      ),
    );
