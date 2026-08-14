import { paint } from '../canvas';
import type { StarColors } from './star-colors';
import { starStep } from './star-step';

export const drawStar = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  colors: StarColors,
  glowBlur: number,
): void => paint(context, starStep(centerX, centerY, radius, colors, glowBlur));
