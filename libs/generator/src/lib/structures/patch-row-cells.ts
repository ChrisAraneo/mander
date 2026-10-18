import { type Tile, chain } from '@mander/model';
import { keyBy, map } from 'lodash-es';
import type { TilePatch } from '../types/tile-patch';

export const patchRowCells = (cells: Tile[], rowPatches: TilePatch[]): Tile[] =>
  chain(keyBy(rowPatches, (patch) => patch.column))
    .thru((byColumn) =>
      map(cells, (tile, column) => byColumn[column]?.tile ?? tile),
    )
    .value();
