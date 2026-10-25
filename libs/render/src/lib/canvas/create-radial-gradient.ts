import type { ColorStop } from '../types/color-stop';
import { addStops } from './add-stops';

export const createRadialGradient = (
  context: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  startRadius: number,
  endX: number,
  endY: number,
  endRadius: number,
  stops: readonly ColorStop[],
): CanvasGradient =>
  addStops(
    context.createRadialGradient(
      startX,
      startY,
      startRadius,
      endX,
      endY,
      endRadius,
    ),
    stops,
  );
