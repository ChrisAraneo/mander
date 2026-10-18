import { draw } from '../canvas/draw';
import { outline } from './outline';

export const strokeOutline = (
  context: CanvasRenderingContext2D,
  lineWidth = 0,
): void => draw(context, outline(lineWidth));
