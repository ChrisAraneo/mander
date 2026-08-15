import type { CanvasStep } from './canvas-step';
import type { CanvasStyle } from './canvas-style';
import { styled } from './styled';

export const styledWith =
  (toStyle: (context: CanvasRenderingContext2D) => CanvasStyle): CanvasStep =>
  (context) =>
    styled(toStyle(context))(context);
