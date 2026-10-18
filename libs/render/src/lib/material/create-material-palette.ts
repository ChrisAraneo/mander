import { parseHsl } from '@mander/utils';
import { match, P } from 'ts-pattern';
import type { MaterialPalette } from '../types/material-palette';
import type { Palette } from '../types/palette';
import { getMaterialStyle } from './get-material-style';
import { createGroundedMaterialPalette } from './internal/create-grounded-material-palette';

const { nullish } = P;

export const createMaterialPalette = (palette: Palette): MaterialPalette =>
  match(parseHsl(palette.block))
    .with(nullish, (): MaterialPalette => getMaterialStyle)
    .otherwise((ground): MaterialPalette =>
      createGroundedMaterialPalette(palette, ground),
    );
