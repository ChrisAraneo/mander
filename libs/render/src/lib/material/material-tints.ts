import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/engine';
import { match } from 'ts-pattern';

import type { MaterialTint } from './material-tint';

const DIRT_TINT: MaterialTint = {};
const BRICK_TINT: MaterialTint = { hue: -20, saturation: 12, lightness: 16 };
const STONE_TINT: MaterialTint = { hue: 183, saturation: -22, lightness: 19 };
const WOOD_TINT: MaterialTint = { hue: -4, lightness: 18 };
const CERAMIC_TINT: MaterialTint = { hue: 265, saturation: 22, lightness: 22 };

export const materialTint = (tile: Tile): MaterialTint =>
  match(tile)
    .with(TILE_BRICK, () => BRICK_TINT)
    .with(TILE_STONE, () => STONE_TINT)
    .with(TILE_WOOD, () => WOOD_TINT)
    .with(TILE_CERAMIC, () => CERAMIC_TINT)
    .otherwise(() => DIRT_TINT);
