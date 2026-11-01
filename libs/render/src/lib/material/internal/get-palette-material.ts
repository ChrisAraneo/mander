import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_ICE,
  TILE_WOOD,
} from '@mander/model';
import { match } from 'ts-pattern';
import type { Palette } from '../../types/palette';
import { ICE_COLOUR } from '../consts';

const NO_COLOUR = '';

export const getPaletteMaterial = (tile: Tile, palette: Palette): string =>
  match(tile)
    .with(TILE_BRICK, () => palette.materials?.brick ?? NO_COLOUR)
    .with(TILE_WOOD, () => palette.materials?.wood ?? NO_COLOUR)
    .with(TILE_CERAMIC, () => palette.materials?.ceramic ?? NO_COLOUR)
    .with(TILE_ICE, () => ICE_COLOUR)
    .otherwise(() => NO_COLOUR);
