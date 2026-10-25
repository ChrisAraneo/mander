import { type Layers, TILE_AIR } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { includes, map } from 'lodash-es';
import { match } from 'ts-pattern';

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

const removeMarker = (grid: number[][], marker: number): number[][] =>
  map(grid, (row) =>
    map(row, (cell) =>
      match(cell)
        .with(marker, () => TILE_AIR)
        .otherwise(() => cell),
    ),
  );

export const removeSketchMarker = (sketch: Layers, value: number): Layers =>
  match(includes(MARKERS, value))
    .with(true, (): Layers => ({
      ...sketch,
      tiles: removeMarker(sketch.tiles, value),
    }))
    .otherwise(() => sketch);
