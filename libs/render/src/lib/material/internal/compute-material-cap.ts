import { type Tile, TILE_DIRT } from '@mander/model';
import { type Hsl, formatHslCss, shiftHsl } from '@mander/utils';
import { match } from 'ts-pattern';
import type { Palette } from '../../types/palette';
import { CAP_LIGHTNESS_GAIN } from '../consts';
import type { MaterialCap } from './types/material-cap';

export const computeMaterialCap = (
  tile: Tile,
  palette: Palette,
  base: Hsl,
): MaterialCap =>
  match(tile === TILE_DIRT)
    .with(true, (): MaterialCap => ({
      cap: palette.blockCap,
      capHighlight: palette.blockCapHighlight,
    }))
    .otherwise((): MaterialCap => ({
      cap: formatHslCss(shiftHsl(base, { lightness: CAP_LIGHTNESS_GAIN })),
      capHighlight: formatHslCss(
        shiftHsl(base, { lightness: CAP_LIGHTNESS_GAIN * 2 }),
      ),
    }));
