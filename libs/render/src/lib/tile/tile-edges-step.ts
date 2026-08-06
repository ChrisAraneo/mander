import { type Level, TILE_SIZE } from '@mander/engine';
import { map } from 'lodash-es';

import { type CanvasStep, fillRect, sequence, styled, when } from '../canvas';
import { STROKE_COLOR, STROKE_WIDTH } from '../stroke';
import { solidAt } from './solid-at';

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

const edgeStep = (
  level: Level,
  column: number,
  row: number,
  edge: Edge,
): CanvasStep =>
  when(
    !solidAt(level, column + edge.column, row + edge.row),
    fillRect(
      column * TILE_SIZE + edge.x,
      row * TILE_SIZE + edge.y,
      edge.width,
      edge.height,
    ),
  );

const cornerStep = (
  level: Level,
  column: number,
  row: number,
  corner: Corner,
): CanvasStep =>
  when(
    !solidAt(level, column + corner.column, row + corner.row) &&
      solidAt(level, column + corner.column, row) &&
      solidAt(level, column, row + corner.row),
    fillRect(
      column * TILE_SIZE + corner.x,
      row * TILE_SIZE + corner.y,
      STROKE_WIDTH,
      STROKE_WIDTH,
    ),
  );

export const tileEdgesStep = (
  level: Level,
  column: number,
  row: number,
): CanvasStep =>
  sequence([
    styled({ fillStyle: STROKE_COLOR }),
    sequence(map(EDGES, (edge) => edgeStep(level, column, row, edge))),
    sequence(map(CORNERS, (corner) => cornerStep(level, column, row, corner))),
  ]);
