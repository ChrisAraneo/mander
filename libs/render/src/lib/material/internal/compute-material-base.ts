import type { Tile } from '@mander/model';
import { match, P } from 'ts-pattern';
import { cloneShiftedHsl } from '../../color/clone-shifted-hsl';
import { parseHsl } from '../../color/parse-hsl';
import type { Hsl } from '../../color/types/hsl';
import type { Palette } from '../../types/palette';
import { getMaterialTint } from '../get-material-tint';
import { getPaletteMaterial } from './get-palette-material';

const { nullish } = P;

export const computeMaterialBase = (
  tile: Tile,
  palette: Palette,
  ground: Hsl,
): Hsl =>
  match(parseHsl(getPaletteMaterial(tile, palette)))
    .with(nullish, () => cloneShiftedHsl(ground, getMaterialTint(tile)))
    .otherwise((colour) => colour);
