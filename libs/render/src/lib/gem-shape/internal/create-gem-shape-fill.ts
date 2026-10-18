import { createLinearGradient } from '../../canvas/create-linear-gradient';
import type { GemColors } from '../../types/gem-colors';

export const createGemShapeFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfHeight: number,
  colors: GemColors,
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
