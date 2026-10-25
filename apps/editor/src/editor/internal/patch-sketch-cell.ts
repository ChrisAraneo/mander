import type { Layers } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { BrushLayer } from '../types/brush-layer';
import { patchGridCell } from './patch-grid-cell';
import { removeSketchMarker } from './remove-sketch-marker';

export const patchSketchCell = (
  sketch: Layers,
  row: number,
  column: number,
  value: number,
  layer: BrushLayer,
): Layers =>
  pipe(
    sketch,
    (layers) => removeSketchMarker(layers, value),
    (cleared) =>
      match(layer)
        .with('back', (): Layers => ({
          ...cleared,
          backTiles: patchGridCell(cleared.backTiles, row, column, value),
        }))
        .otherwise((): Layers => ({
          ...cleared,
          tiles: patchGridCell(cleared.tiles, row, column, value),
        })),
  );
