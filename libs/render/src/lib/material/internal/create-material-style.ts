import { type Tile } from '@mander/model';
import { assign } from 'lodash-es';
import { pipe } from 'remeda';
import { cloneShiftedHsl } from '../../color/clone-shifted-hsl';
import { formatHslCss } from '../../color/format-hsl-css';
import type { Hsl } from '../../color/types/hsl';
import type { MaterialStyle } from '../../types/material-style';
import type { Palette } from '../../types/palette';
import { HIGHLIGHT } from '../consts';
import { getMaterialTint } from '../get-material-tint';
import { computeMaterialCap } from './compute-material-cap';
import { getMaterialJoint } from './get-material-joint';

export const createMaterialStyle = (
  tile: Tile,
  palette: Palette,
  ground: Hsl,
): MaterialStyle =>
  pipe(
    tile,
    getMaterialTint,
    (tint) => cloneShiftedHsl(ground, tint),
    (base): MaterialStyle =>
      assign(
        { base: formatHslCss(base) },
        computeMaterialCap(tile, palette, base),
        {
          joint: getMaterialJoint(tile),
          highlight: HIGHLIGHT,
        },
      ),
  );
