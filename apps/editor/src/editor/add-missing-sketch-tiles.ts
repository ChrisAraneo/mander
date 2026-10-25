import { type Layers, TILE_AIR } from '@mander/model';
import { head, map, range, size, times } from 'lodash-es';
import { pipe } from 'remeda';

const addMissingGridTiles = (
  grid: number[][],
  height: number,
  width: number,
): number[][] =>
  map(range(height), (row) =>
    times(width, (column) => grid[row]?.[column] ?? TILE_AIR),
  );

export const addMissingSketchTiles = (sketch: Layers): Layers =>
  pipe(
    sketch,
    (layers) => ({
      layers,
      height: size(layers.tiles),
      width: size(head(layers.tiles)),
    }),
    ({ layers, height, width }): Layers => ({
      tiles: addMissingGridTiles(layers.tiles, height, width),
      backTiles: addMissingGridTiles(layers.backTiles, height, width),
    }),
  );
