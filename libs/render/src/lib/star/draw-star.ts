import { draw } from '../canvas/draw';
import type { ShadeColors } from '../types/shade-colors';
import { createStarStep } from './create-star-step';

export const drawStar = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  colors: ShadeColors,
): void => draw(context, createStarStep(centerX, centerY, radius, colors));
