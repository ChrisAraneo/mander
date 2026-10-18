import { getFireballHeading } from '@mander/engine';
import type { Fireball } from '@mander/model';
import type { Point } from '@mander/utils';
import type { CanvasStep } from '../../types/canvas-step';
import { createFlameStep } from '../create-flame-step';
import { getFlicker } from '../get-flicker';
import type { FireballColors } from '../types/fireball-colors';
import { FIREBALL_RADIUS } from './consts';

export const createFireballFlameStep = (
  fireball: Fireball,
  position: Point,
  time: number,
  colors: FireballColors,
): CanvasStep =>
  createFlameStep(
    position,
    getFireballHeading(fireball),
    FIREBALL_RADIUS * getFlicker(fireball.angle, time),
    colors,
  );
