import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const roundRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): CanvasStep =>
  run((context) => context.roundRect(x, y, width, height, radius));
