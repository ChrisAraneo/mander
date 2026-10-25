import { SOLID_TILES, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import type { Hsl } from '../../color/types/hsl';
import type { MaterialPalette } from '../../types/material-palette';
import type { MaterialStyle } from '../../types/material-style';
import type { Palette } from '../../types/palette';
import { getMaterialStyle } from '../get-material-style';
import { createMaterialStyle } from './create-material-style';

export const createGroundedMaterialPalette = (
  palette: Palette,
  ground: Hsl,
): MaterialPalette =>
  pipe(
    SOLID_TILES,
    (tiles) =>
      map(tiles, (tile): [Tile, MaterialStyle] => [
        tile,
        createMaterialStyle(tile, palette, ground),
      ]),
    (entries) => new Map<Tile, MaterialStyle>(entries),
    (styles): MaterialPalette =>
      (tile) =>
        styles.get(tile) ?? getMaterialStyle(tile),
  );
