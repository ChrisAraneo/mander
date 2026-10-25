import { type Tile, TILE_DIRT } from '@mander/model';
import { match } from 'ts-pattern';
import { cloneShiftedHsl } from '../../color/clone-shifted-hsl';
import { formatHslCss } from '../../color/format-hsl-css';
import type { Hsl } from '../../color/types/hsl';
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
      cap: formatHslCss(
        cloneShiftedHsl(base, { lightness: CAP_LIGHTNESS_GAIN }),
      ),
      capHighlight: formatHslCss(
        cloneShiftedHsl(base, { lightness: CAP_LIGHTNESS_GAIN * 2 }),
      ),
    }));
