import { type Layers, TILE_AIR } from '@mander/model';
import { chain } from '@mander/utils';
import { head, map, range, size, times } from 'lodash-es';

const filled = (grid: number[][], height: number, width: number): number[][] =>
  map(range(height), (row) =>
    times(width, (column) => grid[row]?.[column] ?? TILE_AIR),
  );

// a sector written with an empty back layer is opened at full size, so there is
// something to paint into
export const fillSketch = (sketch: Layers): Layers =>
  chain({ height: size(sketch.tiles), width: size(head(sketch.tiles)) })
    .thru(({ height, width }): Layers => ({
      tiles: filled(sketch.tiles, height, width),
      backTiles: filled(sketch.backTiles, height, width),
    }))
    .value();
