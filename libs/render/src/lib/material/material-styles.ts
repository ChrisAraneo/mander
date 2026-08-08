import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { match } from 'ts-pattern';

import {
  BRICK_STYLE,
  CERAMIC_STYLE,
  DIRT_STYLE,
  STONE_STYLE,
  WOOD_STYLE,
} from './consts';
import type { MaterialStyle } from './material-style';

export const materialStyle = (tile: Tile): MaterialStyle =>
  match(tile)
    .with(TILE_BRICK, () => BRICK_STYLE)
    .with(TILE_STONE, () => STONE_STYLE)
    .with(TILE_WOOD, () => WOOD_STYLE)
    .with(TILE_CERAMIC, () => CERAMIC_STYLE)
    .otherwise(() => DIRT_STYLE);
