import { paint } from '../canvas';
import type { GemColors } from './gem-colors';
import { gemShapeStep } from './gem-shape-step';

export const drawGemShape = (
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
    gemShapeStep(centerX, centerY, halfWidth, halfHeight, colors, glowBlur),
  );
