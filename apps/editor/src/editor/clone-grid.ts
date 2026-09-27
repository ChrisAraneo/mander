import type { Layers } from '@mander/model';
import { map } from 'lodash-es';

export const cloneGrid = (grid: number[][]): number[][] =>
  map(grid, (row) => [...row]);

export const cloneSketch = (sketch: Layers): Layers => ({
  tiles: cloneGrid(sketch.tiles),
  backTiles: cloneGrid(sketch.backTiles),
});
