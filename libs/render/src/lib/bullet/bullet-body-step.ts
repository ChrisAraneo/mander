import {
  arc,
  beginPath,
  type CanvasStep,
  fill,
  radialGradient,
  restore,
  save,
  sequence,
  styled,
  styledWith,
} from '../canvas';
import { outline } from '../stroke';
import type { BulletColors } from './bullet-colors';

export const bulletBodyStep = (
  centerX: number,
  centerY: number,
  radius: number,
  colors: BulletColors,
  glowBlur: number,
): CanvasStep =>
  sequence([
    save,
    styled({ shadowColor: colors.glow, shadowBlur: glowBlur }),
    beginPath,
    arc(centerX, centerY, radius, 0, Math.PI * 2),
    outline(),
    styledWith((context) => ({
      fillStyle: radialGradient(
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
    styled({ fillStyle: colors.shine }),
    beginPath,
    arc(centerX - radius / 3, centerY - radius / 3, radius / 4, 0, Math.PI * 2),
    fill,
  ]);
