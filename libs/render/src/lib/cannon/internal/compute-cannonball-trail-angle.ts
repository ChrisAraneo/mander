import type { Cannonball } from '@mander/model';

export const computeCannonballTrailAngle = ({ velocity }: Cannonball): number =>
  Math.atan2(velocity.y.current, Math.abs(velocity.x.current));
