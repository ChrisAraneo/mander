import type { Cannon } from '@mander/model';
import type { CannonShot } from './types/cannon-shot';

export const createHeldCannonShot = (cannon: Cannon): CannonShot => ({
  cannon,
  cannonball: undefined,
});
