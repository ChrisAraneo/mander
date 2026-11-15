import {
  findSpawnTile,
  type Level,
  TILE_SIZE,
  type Point,
} from '@mander/model';
import { match, P } from 'ts-pattern';
import { PLAYER_HEIGHT, SPAWN_OFFSET_X } from './consts';

const { nullish } = P;

export const computeSpawnPosition = (level: Level): Point =>
  match(findSpawnTile(level))
    .with(nullish, (): Point => ({ x: 0, y: 0 }))
    .otherwise((tile): Point => ({
      x: tile.x * TILE_SIZE + SPAWN_OFFSET_X,
      y: (tile.y + 1) * TILE_SIZE - PLAYER_HEIGHT - TILE_SIZE,
    }));
