import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const rotate = (angle: number): CanvasStep =>
  run((context) => context.rotate(angle));
