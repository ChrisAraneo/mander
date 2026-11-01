import type { Fireball, Point } from '@mander/model';
import { pipe } from 'remeda';
import { computeFireballRadius } from './internal/compute-fireball-radius';

export const getFireballPosition = (fireball: Fireball): Point =>
  pipe(computeFireballRadius(fireball), (radius) => ({
    x: fireball.origin.x + Math.cos(fireball.angle) * radius,
    y: fireball.origin.y + Math.sin(fireball.angle) * radius,
  }));
