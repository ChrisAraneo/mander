import { isSolidTile, type Tile, TILE_AIR } from '@mander/model';
import type { Cell } from '../../types/cell';

export const isAirborneCell = (
  tiles: Tile[][],
  { row, column }: Cell,
): boolean => !isSolidTile(tiles[row + 1]?.[column] ?? TILE_AIR);
