import { type Level, TILE_SIZE } from '@mander/model';
import { map } from 'lodash-es';

import {
  applyStyle,
  type CanvasStep,
  fillRect,
  runWhen,
  sequence,
} from '../canvas';
import { STROKE_COLOR, STROKE_WIDTH } from '../stroke';
import { isSolidAt } from './is-solid-at';

interface Edge {
  column: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const EDGES: readonly Edge[] = [
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

interface Corner {
  column: number;
  row: number;
  x: number;
  y: number;
}

const FAR = TILE_SIZE - STROKE_WIDTH;

const CORNERS: readonly Corner[] = [
  { column: -1, row: -1, x: 0, y: 0 },
  { column: 1, row: -1, x: FAR, y: 0 },
  { column: -1, row: 1, x: 0, y: FAR },
  { column: 1, row: 1, x: FAR, y: FAR },
];

const createEdgeStep = (
  level: Level,
  column: number,
  row: number,
  edge: Edge,
): CanvasStep =>
  runWhen(
    !isSolidAt(level, column + edge.column, row + edge.row),
    fillRect(
      column * TILE_SIZE + edge.x,
      row * TILE_SIZE + edge.y,
      edge.width,
      edge.height,
    ),
  );

const createCornerStep = (
  level: Level,
  column: number,
  row: number,
  corner: Corner,
): CanvasStep =>
  runWhen(
    !isSolidAt(level, column + corner.column, row + corner.row) &&
      isSolidAt(level, column + corner.column, row) &&
      isSolidAt(level, column, row + corner.row),
    fillRect(
      column * TILE_SIZE + corner.x,
      row * TILE_SIZE + corner.y,
      STROKE_WIDTH,
      STROKE_WIDTH,
    ),
  );

export const createTileEdgesStep = (
  level: Level,
  column: number,
  row: number,
): CanvasStep =>
  sequence([
    applyStyle({ fillStyle: STROKE_COLOR }),
    sequence(map(EDGES, (edge) => createEdgeStep(level, column, row, edge))),
    sequence(
      map(CORNERS, (corner) => createCornerStep(level, column, row, corner)),
    ),
  ]);
