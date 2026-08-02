import { type Level, TILE_SIZE } from '@mander/engine';
import { forEach } from 'lodash-es';
import { match } from 'ts-pattern';

import { solidAt } from './solid-at';
import { STROKE_COLOR, STROKE_WIDTH } from './stroke';

interface Edge {
  /** The neighbour this edge faces. */
  column: number;
  row: number;
  /** The bar to paint, inside the tile's own square. */
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
  /** The diagonal neighbour that has to be open for the corner to show. */
  column: number;
  row: number;
  /** The square to paint, tucked into the tile's own corner. */
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

/**
 * Fills the notch an inside corner leaves. Where a block has neighbours on two
 * touching sides but open air on the diagonal between them —
 *
 * ```
 * 0 1
 * 1 X
 * ```
 *
 * — both of those neighbours bury the edge they share with X, so X draws
 * neither bar. The two bars that do get drawn, down the left of the block above
 * and along the top of the block beside, run into X's corner and stop dead at
 * the point where they meet, leaving one stroke-square of colour showing
 * through the outline. This puts that square back.
 *
 * A corner whose own sides face air needs nothing: the edge bar already runs
 * the full length of the tile and covers it.
 */
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

/**
 * Outlines the sides of a block that face open air. Two blocks shoulder to
 * shoulder share a buried edge and neither draws it, so a wall reads as one
 * mass with a line round the outside rather than a grid of boxes.
 *
 * The bars sit inside the tile rather than straddling its edge: a stroked path
 * would spill half its width into the neighbour and undo the pixel snapping.
 */
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
