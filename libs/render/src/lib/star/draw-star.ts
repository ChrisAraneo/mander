import { paint } from '../canvas';
import type { StarColors } from './star-colors';
import { createStarStep } from './create-star-step';

export const drawStar = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  colors: StarColors,
): void => paint(context, createStarStep(centerX, centerY, radius, colors));
