import { type Tile } from '@mander/model';
import { keyBy, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { TilePatch } from '../types/tile-patch';

export const patchRowCells = (cells: Tile[], rowPatches: TilePatch[]): Tile[] =>
  pipe(
    rowPatches,
    (found) => keyBy(found, (patch) => patch.column),
    (byColumn) => map(cells, (tile, column) => byColumn[column]?.tile ?? tile),
  );
