import { backTileAt, isSolidTile, type Level } from '@mander/model';

export const backAt = (level: Level, tileX: number, tileY: number): boolean =>
  isSolidTile(backTileAt(level, tileX, tileY));
