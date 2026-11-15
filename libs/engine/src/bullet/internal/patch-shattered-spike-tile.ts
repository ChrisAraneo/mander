import type { Level, Point } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { patchShatteredSpikeRow } from './patch-shattered-spike-row';

export const patchShatteredSpikeTile = <L extends Level>(
  level: L,
  tile: Point,
): L => ({
  ...level,
  tiles: map(level.tiles, (cells, row) =>
    match(row === tile.y)
      .with(true, () => patchShatteredSpikeRow(cells, tile.x))
      .otherwise(() => cells),
  ),
});
