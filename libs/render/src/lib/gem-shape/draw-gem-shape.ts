import { paint } from '../canvas';
import type { GemColors } from './gem-colors';
import { createGemShapeStep } from './create-gem-shape-step';

export const drawGemShape = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: GemColors,
): void =>
  paint(
    context,
    createGemShapeStep(centerX, centerY, halfWidth, halfHeight, colors),
  );
