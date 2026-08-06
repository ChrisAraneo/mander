import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const scale = (x: number, y: number): CanvasStep =>
  run((context) => context.scale(x, y));
