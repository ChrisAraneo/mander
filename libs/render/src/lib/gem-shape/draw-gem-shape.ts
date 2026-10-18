import { draw } from '../canvas/draw';
import type { ShadeColors } from '../types/shade-colors';
import { createGemShapeStep } from './create-gem-shape-step';

export const drawGemShape = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: ShadeColors,
): void =>
  draw(
    context,
    createGemShapeStep(centerX, centerY, halfWidth, halfHeight, colors),
  );
