import type { Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { keyBy, map } from 'lodash-es';
import type { TilePatch } from '../types/tile-patch';

export const patchRowCells = (cells: Tile[], rowPatches: TilePatch[]): Tile[] =>
  chain(keyBy(rowPatches, (patch) => patch.column))
    .thru((byColumn) =>
      map(cells, (tile, column) => byColumn[column]?.tile ?? tile),
    )
    .value();
