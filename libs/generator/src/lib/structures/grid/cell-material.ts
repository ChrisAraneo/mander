import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/engine';
import { match } from 'ts-pattern';

import { BRICK, CERAMIC, STONE, WOOD } from '../types';

export const cellMaterial = (cell: number): Tile =>
  match(cell)
    .with(BRICK, (): Tile => TILE_BRICK)
    .with(STONE, (): Tile => TILE_STONE)
    .with(WOOD, (): Tile => TILE_WOOD)
    .with(CERAMIC, (): Tile => TILE_CERAMIC)
    .otherwise((): Tile => TILE_DIRT);
