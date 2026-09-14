import {
  applyStyle,
  applyStyleWith,
  beginPath,
  type CanvasStep,
  createRadialGradient,
  fill,
  restore,
  save,
  sequence,
  traceArc,
} from '../canvas';
import { outline } from '../stroke';
import type { BulletColors } from './bullet-colors';

export const createBulletBodyStep = (
  centerX: number,
  centerY: number,
  radius: number,
  colors: BulletColors,
  glowBlur: number,
): CanvasStep =>
  sequence([
    save,
    applyStyle({ shadowColor: colors.glow, shadowBlur: glowBlur }),
    beginPath,
    traceArc(centerX, centerY, radius, 0, Math.PI * 2),
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createRadialGradient(
        context,
        centerX - radius / 3,
        centerY - radius / 3,
        1,
        centerX,
        centerY,
        radius,
        [
          [0, colors.light],
          [1, colors.deep],
        ],
      ),
    })),
    fill,
    restore,
    applyStyle({ fillStyle: colors.shine }),
    beginPath,
    traceArc(
      centerX - radius / 3,
      centerY - radius / 3,
      radius / 4,
      0,
      Math.PI * 2,
    ),
    fill,
  ]);
