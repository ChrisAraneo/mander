import type { ColorStop } from '../types/color-stop';
import { addStops } from './add-stops';

export const createLinearGradient = (
  context: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  stops: readonly ColorStop[],
): CanvasGradient =>
  addStops(context.createLinearGradient(startX, startY, endX, endY), stops);
