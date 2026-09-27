import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const traceLineTo = (x: number, y: number): CanvasStep =>
  run((context) => context.lineTo(x, y));
