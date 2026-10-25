import type { Layers } from '@mander/model';
import { cloneGrid } from './clone-grid';

export const cloneSketch = (sketch: Layers): Layers => ({
  tiles: cloneGrid(sketch.tiles),
  backTiles: cloneGrid(sketch.backTiles),
});
