import type { CanvasStep } from '../types/canvas-step';
import { createAngledTrailStep } from './create-angled-trail-step';

export const createTrailStep = (
  color: string,
  length: number,
  height: number,
): CanvasStep => createAngledTrailStep(color, length, height, 0);
