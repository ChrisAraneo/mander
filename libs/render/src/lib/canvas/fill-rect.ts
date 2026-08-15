import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const fillRect = (
  x: number,
  y: number,
  width: number,
  height: number,
): CanvasStep => run((context) => context.fillRect(x, y, width, height));
