import { paint } from '../canvas';
import { outline } from './outline';

export const strokeOutline = (
  context: CanvasRenderingContext2D,
  lineWidth = 0,
): void => paint(context, outline(lineWidth));
