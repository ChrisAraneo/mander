import { paint } from '../canvas';
import type { GemColors } from './gem-colors';
import { gemStep } from './gem-step';

export const drawGem = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: GemColors,
  glowBlur: number,
): void =>
  paint(
    context,
    gemStep(centerX, centerY, halfWidth, halfHeight, colors, glowBlur),
  );
