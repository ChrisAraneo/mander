import { match } from 'ts-pattern';
import type { Tile } from '../types/tile';
import { TILE_BEARTRAP } from './tile-beartrap';
import { TILE_ENEMY_FAST } from './tile-enemy-fast';
import { TILE_ENEMY_FLYING } from './tile-enemy-flying';
import { TILE_ENEMY_HOPPING } from './tile-enemy-hopping';
import { TILE_ENEMY_HORNED } from './tile-enemy-horned';
import { TILE_ENEMY_SHOOTER } from './tile-enemy-shooter';
import type { EnemyKind } from './types/enemy-kind';

export const toTileEnemyKind = (tile: Tile): EnemyKind | null =>
  match(tile)
    .with(TILE_ENEMY_HOPPING, (): EnemyKind => 'HOPPING')
    .with(TILE_ENEMY_HORNED, (): EnemyKind => 'HORNED')
    .with(TILE_ENEMY_FAST, (): EnemyKind => 'FAST')
    .with(TILE_ENEMY_SHOOTER, (): EnemyKind => 'SHOOTER')
    .with(TILE_ENEMY_FLYING, (): EnemyKind => 'FLYING')
    .with(TILE_BEARTRAP, (): EnemyKind => 'BEARTRAP')
    .otherwise(() => null);
