import type { Tile } from '@mander/model';
import { range, size } from 'lodash-es';
import type { PlayerSpawnColumns } from './interfaces';

export const createColumnNumbers = (tiles: Tile[][]): PlayerSpawnColumns => ({
  tiles,
  columns: range(size(tiles[0])),
});
