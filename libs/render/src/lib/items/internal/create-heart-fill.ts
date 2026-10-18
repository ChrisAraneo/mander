import { createLinearGradient } from '../../canvas/create-linear-gradient';
import { HEART_TIP } from './consts';

const HEART_LIGHT = '#FFC2CE';

const HEART_BASE = '#FF5470';

const HEART_DEEP = '#8E1B33';

export const createHeartFill = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasGradient =>
  createLinearGradient(
    context,
    centerX - lobe,
    centerY - lobe * 1.3,
    centerX + lobe,
    centerY + lobe * HEART_TIP,
    [
      [0, HEART_LIGHT],
      [0.4, HEART_BASE],
      [1, HEART_DEEP],
    ],
  );
