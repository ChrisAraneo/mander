import { isSolidTile, type Level } from '@mander/model';
import { inRange } from 'lodash-es';

export const isSolidAt = (level: Level, column: number, row: number): boolean =>
  inRange(column, 0, level.width) &&
  inRange(row, 0, level.height) &&
  isSolidTile(level.tiles[row][column]);
