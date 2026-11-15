import type { Point } from '@mander/model';
import type { FireballOrbit } from './types/fireball-orbit';

export const createOrbitPoint = (
  origin: Point,
  { radius, angle }: FireballOrbit,
): Point => ({
  x: origin.x + Math.cos(angle) * radius,
  y: origin.y + Math.sin(angle) * radius,
});
