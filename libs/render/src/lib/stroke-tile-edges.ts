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
};
