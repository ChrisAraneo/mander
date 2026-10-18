import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_FIREBALL,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { match } from 'ts-pattern';
import type { MaterialStyle } from '../types/material-style';
import {
  BRICK_STYLE,
  CERAMIC_STYLE,
  DIRT_STYLE,
  FIREBALL_STYLE,
  STONE_STYLE,
  WOOD_STYLE,
} from './consts';

export const getMaterialStyle = (tile: Tile): MaterialStyle =>
  match(tile)
    .with(TILE_BRICK, () => BRICK_STYLE)
    .with(TILE_STONE, () => STONE_STYLE)
    .with(TILE_WOOD, () => WOOD_STYLE)
    .with(TILE_CERAMIC, () => CERAMIC_STYLE)
    .with(TILE_FIREBALL, () => FIREBALL_STYLE)
    .otherwise(() => DIRT_STYLE);
