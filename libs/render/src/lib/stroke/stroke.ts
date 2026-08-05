export const STROKE_COLOR = '#000000';
export const STROKE_WIDTH = 2;

export const strokeOutline = (
  context: CanvasRenderingContext2D,
  lineWidth = 0,
): void => {
  context.strokeStyle = STROKE_COLOR;
  context.lineWidth = lineWidth + STROKE_WIDTH * 2;
  context.lineJoin = 'round';
  context.stroke();
};
