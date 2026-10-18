import type { CanvasStep } from '../types/canvas-step';
import { createActionStep } from './create-action-step';

export const createSetTransformStep = (
  horizontalScale: number,
  verticalSkew: number,
  horizontalSkew: number,
  verticalScale: number,
  horizontalShift: number,
  verticalShift: number,
): CanvasStep =>
  createActionStep((context) =>
    context.setTransform(
      horizontalScale,
      verticalSkew,
      horizontalSkew,
      verticalScale,
      horizontalShift,
      verticalShift,
    ),
  );
