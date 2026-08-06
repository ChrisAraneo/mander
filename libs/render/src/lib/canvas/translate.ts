import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const translate = (x: number, y: number): CanvasStep =>
  run((context) => context.translate(x, y));
