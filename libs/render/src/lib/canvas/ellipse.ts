import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const ellipse = (
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
): CanvasStep =>
  run((context) =>
    context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle),
  );
