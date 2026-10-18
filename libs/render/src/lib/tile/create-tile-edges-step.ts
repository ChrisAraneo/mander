import { TILE_SIZE, type Level } from '@mander/model';
import { map } from 'lodash-es';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { STROKE_WIDTH, STROKE_COLOR } from '../stroke/consts';
import type { CanvasStep } from '../types/canvas-step';
import { createTileCornerStep } from './internal/create-tile-corner-step';
import { createTileEdgeStep } from './internal/create-tile-edge-step';
import type { TileCorner } from './internal/types/tile-corner';
import type { TileEdge } from './internal/types/tile-edge';

const EDGES: readonly TileEdge[] = [
  { column: 0, row: -1, x: 0, y: 0, width: TILE_SIZE, height: STROKE_WIDTH },
  {
    column: 0,
    row: 1,
    x: 0,
    y: TILE_SIZE - STROKE_WIDTH,
    width: TILE_SIZE,
    height: STROKE_WIDTH,
  },
  { column: -1, row: 0, x: 0, y: 0, width: STROKE_WIDTH, height: TILE_SIZE },
  {
    column: 1,
    row: 0,
    x: TILE_SIZE - STROKE_WIDTH,
    y: 0,
    width: STROKE_WIDTH,
    height: TILE_SIZE,
  },
];

const FAR = TILE_SIZE - STROKE_WIDTH;

const CORNERS: readonly TileCorner[] = [
  { column: -1, row: -1, x: 0, y: 0 },
  { column: 1, row: -1, x: FAR, y: 0 },
  { column: -1, row: 1, x: 0, y: FAR },
  { column: 1, row: 1, x: FAR, y: FAR },
];

export const createTileEdgesStep = (
  level: Level,
  column: number,
  row: number,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: STROKE_COLOR }),
    createSequenceStep(
      map(EDGES, (edge) => createTileEdgeStep(level, column, row, edge)),
    ),
    createSequenceStep(
      map(CORNERS, (corner) =>
        createTileCornerStep(level, column, row, corner),
      ),
    ),
  ]);
