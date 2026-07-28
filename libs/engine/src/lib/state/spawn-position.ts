import { type Level, type Point, spawnTile, TILE_SIZE } from '@mander/model';
import { match, P } from 'ts-pattern';

import { PLAYER_HEIGHT } from './constants';

const SPAWN_OFFSET_X = 5;

export const spawnPosition = (level: Level): Point =>
  match(spawnTile(level))
    .with(P.nullish, (): Point => ({ x: 0, y: 0 }))
    .otherwise(
      (tile): Point => ({
        x: tile.x * TILE_SIZE + SPAWN_OFFSET_X,
        y: (tile.y + 1) * TILE_SIZE - PLAYER_HEIGHT - TILE_SIZE,
      }),
    );
