import { TILE_AIR } from '@mander/model';
import { map, range, times } from 'lodash-es';

export const addMissingGridTiles = (
  grid: number[][],
  height: number,
  width: number,
): number[][] =>
  map(range(height), (row) =>
    times(width, (column) => grid[row]?.[column] ?? TILE_AIR),
  );
