import { getBackTileAt, isSolidTile, type Level } from '@mander/model';

export const isBackAt = (level: Level, tileX: number, tileY: number): boolean =>
  isSolidTile(getBackTileAt(level, tileX, tileY));
