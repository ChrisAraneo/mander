import type { CanvasStep } from './canvas-step';
import type { CanvasStyle } from './canvas-style';
import { applyStyle } from './apply-style';

export const applyStyleWith =
  (toStyle: (context: CanvasRenderingContext2D) => CanvasStyle): CanvasStep =>
  (context) =>
    applyStyle(toStyle(context))(context);
