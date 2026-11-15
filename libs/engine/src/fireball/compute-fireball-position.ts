import type { Fireball, Point } from '@mander/model';
import { computeFireballOrbit } from './internal/compute-fireball-orbit';
import { createOrbitPoint } from './internal/create-orbit-point';

export const computeFireballPosition = (fireball: Fireball): Point =>
  createOrbitPoint(fireball.origin, computeFireballOrbit(fireball));
