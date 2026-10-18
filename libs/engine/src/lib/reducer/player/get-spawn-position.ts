import { findSpawnTile, type Level, TILE_SIZE, type Point } from '@mander/model';
import { match, P } from 'ts-pattern';
import { PLAYER_HEIGHT } from './consts';

const { nullish } = P;

const SPAWN_OFFSET_X = 5;

export const getSpawnPosition = (level: Level): Point =>
  match(findSpawnTile(level))
    .with(nullish, (): Point => ({ x: 0, y: 0 }))
    .otherwise((tile): Point => ({
      x: tile.x * TILE_SIZE + SPAWN_OFFSET_X,
      y: (tile.y + 1) * TILE_SIZE - PLAYER_HEIGHT - TILE_SIZE,
    }));
