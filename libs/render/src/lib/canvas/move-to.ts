import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const moveTo = (x: number, y: number): CanvasStep =>
  run((context) => context.moveTo(x, y));
