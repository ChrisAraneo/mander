import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_FIREBALL,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { match } from 'ts-pattern';

import type { MaterialTint } from './material-tint';

const DIRT_TINT: MaterialTint = {};
const BRICK_TINT: MaterialTint = { hue: -20, saturation: 2, lightness: 16 };
const STONE_TINT: MaterialTint = { hue: 183, saturation: -22, lightness: 19 };
const WOOD_TINT: MaterialTint = { hue: -4, saturation: -4, lightness: 16 };
const CERAMIC_TINT: MaterialTint = { hue: 265, saturation: -8, lightness: 24 };
const FIREBALL_TINT: MaterialTint = {
  hue: -18,
  saturation: -10,
  lightness: -26,
};

export const materialTint = (tile: Tile): MaterialTint =>
  match(tile)
    .with(TILE_BRICK, () => BRICK_TINT)
    .with(TILE_STONE, () => STONE_TINT)
    .with(TILE_WOOD, () => WOOD_TINT)
    .with(TILE_CERAMIC, () => CERAMIC_TINT)
    .with(TILE_FIREBALL, () => FIREBALL_TINT)
    .otherwise(() => DIRT_TINT);
