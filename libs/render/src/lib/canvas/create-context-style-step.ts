import type { CanvasStep } from '../types/canvas-step';
import { createStyleStep } from './create-style-step';
import type { CanvasStyle } from './types/canvas-style';

export const createContextStyleStep =
  (toStyle: (context: CanvasRenderingContext2D) => CanvasStyle): CanvasStep =>
  (context) =>
    createStyleStep(toStyle(context))(context);
