import { draw } from '../canvas/draw';
import type { StarColors } from '../types/star-colors';
import { createStarStep } from './create-star-step';

export const drawStar = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  colors: StarColors,
): void => draw(context, createStarStep(centerX, centerY, radius, colors));
