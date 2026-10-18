import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createEllipseStep = (
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
): CanvasStep =>
  createActionStep((context) =>
    context.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
    ),
  );
