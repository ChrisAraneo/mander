import type { CanvasStep } from '../../types/canvas-step';
import { createHeartShoulderPathStep } from './create-heart-shoulder-path-step';

const HEART_LIFT = 0.3;

export const createHeartPathStep = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep =>
  createHeartShoulderPathStep(centerX, centerY - lobe * HEART_LIFT, lobe);
