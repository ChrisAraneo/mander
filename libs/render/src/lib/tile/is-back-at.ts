import { getBackTileAt, isSolidTile, type Level } from '@mander/model';

export const isBackAt = (level: Level, column: number, row: number): boolean =>
  isSolidTile(getBackTileAt(level, column, row));
