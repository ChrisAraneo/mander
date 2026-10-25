import { type Tile } from '@mander/model';
import { groupBy, map } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import type { TilePatch } from '../types/tile-patch';
import { patchRowCells } from './patch-row-cells';

const { nullish } = P;

export const patchTiles = (tiles: Tile[][], patches: TilePatch[]): Tile[][] =>
  pipe(
    patches,
    (found) => groupBy(found, (patch) => patch.row),
    (byRow) =>
      map(tiles, (cells, row) =>
        match(byRow[row])
          .with(nullish, () => [...cells])
          .otherwise((rowPatches) => patchRowCells(cells, rowPatches)),
      ),
  );
