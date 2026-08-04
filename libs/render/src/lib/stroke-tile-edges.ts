import { type Level, TILE_SIZE } from '@mander/engine';
import { forEach } from 'lodash-es';
import { match } from 'ts-pattern';

import { solidAt } from './solid-at';
import { STROKE_COLOR, STROKE_WIDTH } from './stroke';

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

const strokeInsideCorners = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => {
  forEach(CORNERS, (corner) =>
    match(
      !solidAt(level, column + corner.column, row + corner.row) &&
        solidAt(level, column + corner.column, row) &&
        solidAt(level, column, row + corner.row),
    )
      .with(true, () =>
        context.fillRect(
          column * TILE_SIZE + corner.x,
          row * TILE_SIZE + corner.y,
          STROKE_WIDTH,
          STROKE_WIDTH,
        ),
      )
      .otherwise(() => undefined),
  );
};

export const strokeTileEdges = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => {
  context.fillStyle = STROKE_COLOR;
  forEach(EDGES, (edge) =>
    match(solidAt(level, column + edge.column, row + edge.row))
      .with(false, () =>
        context.fillRect(
          column * TILE_SIZE + edge.x,
          row * TILE_SIZE + edge.y,
          edge.width,
          edge.height,
        ),
      )
      .otherwise(() => undefined),
  );
  strokeInsideCorners(context, level, column, row);
};
