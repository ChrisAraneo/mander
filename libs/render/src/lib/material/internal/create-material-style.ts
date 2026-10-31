import { type Tile } from '@mander/model';
import { assign } from 'lodash-es';
import { pipe } from 'remeda';
import { formatHslCss } from '../../color/format-hsl-css';
import type { Hsl } from '../../color/types/hsl';
import type { MaterialStyle } from '../../types/material-style';
import type { Palette } from '../../types/palette';
import { HIGHLIGHT } from '../consts';
import { computeMaterialBase } from './compute-material-base';
import { computeMaterialCap } from './compute-material-cap';
import { getMaterialJoint } from './get-material-joint';

export const createMaterialStyle = (
  tile: Tile,
  palette: Palette,
  ground: Hsl,
): MaterialStyle =>
  pipe(computeMaterialBase(tile, palette, ground), (base): MaterialStyle =>
    assign(
      { base: formatHslCss(base) },
      computeMaterialCap(tile, palette, base),
      {
        joint: getMaterialJoint(tile),
        highlight: HIGHLIGHT,
      },
    ),
  );
