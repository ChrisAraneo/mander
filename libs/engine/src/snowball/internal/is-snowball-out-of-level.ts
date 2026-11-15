import { type Level, type Snowball, TILE_SIZE } from '@mander/model';
import { SNOWBALL_SIZE } from '../consts';

export const isSnowballOutOfLevel = (
  level: Level,
  snowball: Snowball,
): boolean =>
  snowball.position.x + SNOWBALL_SIZE < 0 ||
  snowball.position.x > level.width * TILE_SIZE;
