import { SOLID_TILES, type Tile } from '@mander/model';
import { type Hsl, chain } from '@mander/utils';
import { map } from 'lodash-es';
import type { MaterialPalette } from '../../types/material-palette';
import type { MaterialStyle } from '../../types/material-style';
import type { Palette } from '../../types/palette';
import { getMaterialStyle } from '../get-material-style';
import { createMaterialStyle } from './create-material-style';

export const createGroundedMaterialPalette = (
  palette: Palette,
  ground: Hsl,
): MaterialPalette =>
  chain(SOLID_TILES)
    .thru((tiles) =>
      map(tiles, (tile): [Tile, MaterialStyle] => [
        tile,
        createMaterialStyle(tile, palette, ground),
      ]),
    )
    .thru((entries) => new Map<Tile, MaterialStyle>(entries))
    .thru(
      (styles): MaterialPalette =>
        (tile) =>
          styles.get(tile) ?? getMaterialStyle(tile),
    )
    .value();
