import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
): CanvasStep => run((context) => context.rect(x, y, width, height));
