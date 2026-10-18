import { draw } from '../canvas/draw';
import type { GemColors } from '../types/gem-colors';
import { createGemShapeStep } from './create-gem-shape-step';

export const drawGemShape = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: GemColors,
): void =>
  draw(
    context,
    createGemShapeStep(centerX, centerY, halfWidth, halfHeight, colors),
  );
