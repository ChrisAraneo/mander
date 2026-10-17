import type { Point } from '@mander/utils';
import { FIREBALL_STAGGER_ANGLE, FIREBALL_STAGGER_STEPS } from '../consts';

export const computeFireballStartingAngle = (tile: Point): number =>
  ((tile.x + tile.y) % FIREBALL_STAGGER_STEPS) * FIREBALL_STAGGER_ANGLE;
