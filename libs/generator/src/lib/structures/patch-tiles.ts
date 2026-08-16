import type { Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export interface TilePatch {
  row: number;
  column: number;
  tile: Tile;
}

/**
 * Returns a fully fresh grid — every row is a new array — with each patch
 * applied. Later patches for the same cell win, matching the order a
 * sequential write would have had. Rows without patches are copied straight
 * across so a patch set only pays for the rows it touches.
 */
export const patchTiles = (tiles: Tile[][], patches: TilePatch[]): Tile[][] =>
  chain(patches)
    .groupBy('row')
    .thru((byRow) =>
      map(tiles, (cells, row) =>
        match(byRow[row])
          .with(nullish, () => [...cells])
          .otherwise((rowPatches) =>
            chain(rowPatches)
              .keyBy('column')
              .thru((byColumn) =>
                map(cells, (tile, column) => byColumn[column]?.tile ?? tile),
              )
              .value(),
          ),
      ),
    )
    .value();
