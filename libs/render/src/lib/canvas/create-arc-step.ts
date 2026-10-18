import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createArcStep = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): CanvasStep =>
  createActionStep((context) =>
    context.arc(centerX, centerY, radius, startAngle, endAngle),
  );
