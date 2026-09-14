import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const traceArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): CanvasStep =>
  run((context) => context.arc(x, y, radius, startAngle, endAngle));
