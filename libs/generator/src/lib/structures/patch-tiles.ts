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
