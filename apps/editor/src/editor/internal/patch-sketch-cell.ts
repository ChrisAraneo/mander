import type { Layers } from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { BrushLayer } from '../types/brush-layer';
import { removeSketchMarker } from './remove-sketch-marker';

const patchGridCell = (
  grid: number[][],
  row: number,
  column: number,
  value: number,
): number[][] =>
  map(grid, (cells, rowIndex) =>
    match(rowIndex)
      .with(row, () =>
        map(cells, (cell, columnIndex) =>
          match(columnIndex)
            .with(column, () => value)
            .otherwise(() => cell),
        ),
      )
      .otherwise(() => cells),
  );

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
