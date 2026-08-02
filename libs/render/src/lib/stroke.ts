/**
 * Everything in the world is outlined in the same black line, so the player,
 * the blocks they stand on and the things that hurt them all read as cut from
 * one sheet rather than painted at different depths.
 */
export const STROKE_COLOR = '#000000';
export const STROKE_WIDTH = 2;

/**
 * Lays a black line under the current path for the caller to paint over. The
 * line is stroked wider than the artwork so the fill that follows buries its
 * inner half and exactly STROKE_WIDTH is left showing outside: the outline
 * never eats into the colours, and a shape laid over its neighbour keeps its
 * own edge.
 *
 * Pass the width the artwork itself is stroked at when the shape is a line
 * rather than a fill; a filled shape leaves it at zero.
 */
export const strokeOutline = (
  context: CanvasRenderingContext2D,
  lineWidth = 0,
): void => {
  context.strokeStyle = STROKE_COLOR;
  context.lineWidth = lineWidth + STROKE_WIDTH * 2;
  // A mitred corner runs the black well past a sharp point — several pixels
  // beyond the tip of a spike. Rounding keeps the outline the width it claims.
  context.lineJoin = 'round';
  context.stroke();
};
