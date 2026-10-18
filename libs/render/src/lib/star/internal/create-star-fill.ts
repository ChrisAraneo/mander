import { createLinearGradient } from '../../canvas/create-linear-gradient';
import type { StarColors } from '../../types/star-colors';

export const createStarFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  colors: StarColors,
): CanvasGradient =>
  createLinearGradient(
    context,
    centerX,
    centerY - radius,
    centerX,
    centerY + radius,
    [
      [0, colors.light],
      [0.45, colors.base],
      [1, colors.deep],
    ],
  );
