import type { Layers } from '@mander/model';
import { match } from 'ts-pattern';
import type { BrushLayer } from '../types/brush-layer';

export const getSketchGrid = (sketch: Layers, layer: BrushLayer): number[][] =>
  match(layer)
    .with('back', () => sketch.backTiles)
    .otherwise(() => sketch.tiles);
