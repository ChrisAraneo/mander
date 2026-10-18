import type { Tile } from '@mander/model';
import { type Hsl, chain, shiftHsl, formatHslCss } from '@mander/utils';
import { assign } from 'lodash-es';
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
  chain(shiftHsl(ground, getMaterialTint(tile)))
    .thru((base): MaterialStyle =>
      assign(
        { base: formatHslCss(base) },
        computeMaterialCap(tile, palette, base),
        {
          joint: getMaterialJoint(tile),
          highlight: HIGHLIGHT,
        },
      ),
    )
    .value();
