import { FIREBALL_SIZE, getFireballHeading } from '@mander/engine';
import type { Fireball, Point } from '@mander/model';
import type { CanvasStep } from '../../types/canvas-step';
import { computeFlicker } from '../compute-flicker';
import { createFlameStep } from '../create-flame-step';
import type { FireballColors } from '../types/fireball-colors';

const FIREBALL_RADIUS = FIREBALL_SIZE / 2;

export const createFireballFlameStep = (
  fireball: Fireball,
  position: Point,
  time: number,
  colors: FireballColors,
): CanvasStep =>
  createFlameStep(
    position,
    getFireballHeading(fireball),
    FIREBALL_RADIUS * computeFlicker(fireball.angle, time),
    colors,
  );
