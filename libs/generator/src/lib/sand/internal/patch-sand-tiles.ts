import { type Tile, TILE_SAND } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

export const patchSandTiles = (
  tiles: Tile[][],
  sandable: Tile | undefined,
): Tile[][] =>
  map(tiles, (row) =>
    map(row, (tile) =>
      match(tile === sandable)
        .with(true, () => TILE_SAND)
        .otherwise(() => tile),
    ),
  );
