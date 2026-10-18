import { createLinearGradient } from '../canvas/create-linear-gradient';
import type { ShadeColors } from '../types/shade-colors';

export const createShadeFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfHeight: number,
  colors: ShadeColors,
): CanvasGradient =>
  createLinearGradient(
    context,
    centerX,
    centerY - halfHeight,
    centerX,
    centerY + halfHeight,
    [
      [0, colors.light],
      [0.45, colors.base],
      [1, colors.deep],
    ],
  );
