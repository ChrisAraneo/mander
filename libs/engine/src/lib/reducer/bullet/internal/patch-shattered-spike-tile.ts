import { type Level, TILE_AIR, type Point } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

export const patchShatteredSpikeTile = <L extends Level>(
  level: L,
  tile: Point,
): L => ({
  ...level,
  tiles: map(level.tiles, (cells, row) =>
    match(row === tile.y)
      .with(true, () =>
        map(cells, (cell, column) =>
          match(column === tile.x)
            .with(true, () => TILE_AIR)
            .otherwise(() => cell),
        ),
      )
      .otherwise(() => cells),
  ),
});
