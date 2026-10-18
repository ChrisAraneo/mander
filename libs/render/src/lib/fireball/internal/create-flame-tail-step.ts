import { createTrailStep } from '../../trail/create-trail-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { FireballColors } from '../types/fireball-colors';
import { TAIL_LENGTH } from './consts';

const TAIL_HEIGHT = 4.5;

export const createFlameTailStep = (
  colors: FireballColors,
  length: number,
): CanvasStep =>
  createTrailStep(colors.tail, length, (TAIL_HEIGHT * length) / TAIL_LENGTH);
