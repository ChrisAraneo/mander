import type { Tile } from '../types/tile';
import { TILE_ENEMY } from './tile-enemy';
import { TILE_ENEMY_FAST } from './tile-enemy-fast';
import { TILE_ENEMY_FLYING } from './tile-enemy-flying';
import { TILE_ENEMY_HOPPING } from './tile-enemy-hopping';
import { TILE_ENEMY_HORNED } from './tile-enemy-horned';
import { TILE_ENEMY_SHOOTER } from './tile-enemy-shooter';

export const GROUND_ENEMY_TILES: readonly Tile[] = Object.freeze([
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_FAST,
  TILE_ENEMY_SHOOTER,
]);

export const ENEMY_TILES: readonly Tile[] = Object.freeze([
  TILE_ENEMY,
  ...GROUND_ENEMY_TILES,
  TILE_ENEMY_FLYING,
]);
