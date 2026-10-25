import { type Level } from '@mander/model';
import { flatMap, map } from 'lodash-es';
import { pipe } from 'remeda';
import { draw } from '../canvas/draw';
import { createMaterialPalette } from '../material/create-material-palette';
import type { Palette } from '../types/palette';
import type { Viewport } from '../types/viewport';
import { computeVisibleTileRange } from './internal/compute-visible-tile-range';
import { createBackLayerTileStep } from './internal/create-back-layer-tile-step';
import { createFrontLayerTileStep } from './internal/create-front-layer-tile-step';

export const drawTiles = (
  context: CanvasRenderingContext2D,
  level: Level,
  palette: Palette,
  cameraX: number,
  cameraY: number,
  viewport: Viewport,
): void =>
  pipe(
    {
      materials: createMaterialPalette(palette),
      columns: computeVisibleTileRange(
        cameraX,
        viewport.width,
        level.width - 1,
      ),
      rows: computeVisibleTileRange(cameraY, viewport.height, level.height - 1),
    },
    ({ materials, columns, rows }) => [
      ...flatMap(columns, (column) =>
        map(rows, (row) =>
          createBackLayerTileStep(level, column, row, materials),
        ),
      ),
      ...flatMap(columns, (column) =>
        map(rows, (row) =>
          createFrontLayerTileStep(level, column, row, materials),
        ),
      ),
    ],
    (steps) => draw(context, ...steps),
  );
