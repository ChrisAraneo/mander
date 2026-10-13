import type { Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { groupBy, map } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { TilePatch } from '../types/tile-patch';
import { patchRowCells } from './patch-row-cells';

const { nullish } = P;

export const patchTiles = (tiles: Tile[][], patches: TilePatch[]): Tile[][] =>
  chain(groupBy(patches, (patch) => patch.row))
    .thru((byRow) =>
      map(tiles, (cells, row) =>
        match(byRow[row])
          .with(nullish, () => [...cells])
          .otherwise((rowPatches) => patchRowCells(cells, rowPatches)),
      ),
    )
    .value();
