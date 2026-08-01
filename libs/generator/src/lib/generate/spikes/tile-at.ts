import { isSolidTile, type Tile, TILE_AIR, TILE_SPIKE } from '@mander/engine';

/** Off the grid reads as sky, which is what sits above and beside a level. */
export const tileAt = (tiles: Tile[][], row: number, column: number): Tile =>
  tiles[row]?.[column] ?? TILE_AIR;

export const isAirAt = (
  tiles: Tile[][],
  row: number,
  column: number,
): boolean => tileAt(tiles, row, column) === TILE_AIR;

export const isSolidAt = (
  tiles: Tile[][],
  row: number,
  column: number,
): boolean => isSolidTile(tileAt(tiles, row, column));

/**
 * Only ground spikes. The ceiling spikes a structure hangs are authored by
 * hand and the sweep leaves them alone — see `dropSqueezedSpikes`, which
 * removes the ground spike of a pair and never the one overhead.
 */
export const isSpikeAt = (
  tiles: Tile[][],
  row: number,
  column: number,
): boolean => tileAt(tiles, row, column) === TILE_SPIKE;
