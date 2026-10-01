import { isSolidTile, type Tile, TILE_DIRT } from '@mander/model';
import { filter, flatMap, map, range, size, takeRight } from 'lodash-es';
import { VERTICAL_GROUND_DEPTH } from '../../../consts';
import type { TilePatch } from '../../types/tile-patch';

export const createGroundPatches = (tiles: Tile[][]): TilePatch[] =>
  filter(
    flatMap(takeRight(range(size(tiles)), VERTICAL_GROUND_DEPTH), (row) =>
      map(range(size(tiles[row])), (column): TilePatch => ({
        row,
        column,
        tile: TILE_DIRT,
      })),
    ),
    ({ row, column }) => !isSolidTile(tiles[row][column]),
  );
