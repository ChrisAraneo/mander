import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_FIREBALL,
  TILE_ICE,
  TILE_ICEBALL,
  TILE_PINKBALL,
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
  ICE_STYLE,
  ICEBALL_STYLE,
  PINKBALL_STYLE,
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
    .with(TILE_ICE, () => ICE_STYLE)
    .with(TILE_ICEBALL, () => ICEBALL_STYLE)
    .with(TILE_PINKBALL, () => PINKBALL_STYLE)
    .otherwise(() => DIRT_STYLE);
