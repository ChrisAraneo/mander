import type { Fireball, Point } from '@mander/model';
import { pipe } from 'remeda';
import { computeFireballOrbit } from './internal/compute-fireball-orbit';

export const getFireballPosition = (fireball: Fireball): Point =>
  pipe(computeFireballOrbit(fireball), ({ radius, angle }) => ({
    x: fireball.origin.x + Math.cos(angle) * radius,
    y: fireball.origin.y + Math.sin(angle) * radius,
  }));
