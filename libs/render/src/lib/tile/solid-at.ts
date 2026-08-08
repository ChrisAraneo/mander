import { isSolidTile, type Level } from '@mander/model';
import { inRange } from 'lodash-es';

export const solidAt = (level: Level, tileX: number, tileY: number): boolean =>
  inRange(tileX, 0, level.width) &&
  inRange(tileY, 0, level.height) &&
  isSolidTile(level.tiles[tileY][tileX]);
