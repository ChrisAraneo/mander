import type { Cannonball } from '@mander/model';

export const patchCannonballPosition = (
  cannonball: Cannonball,
  deltaSeconds: number,
): Cannonball => ({
  ...cannonball,
  position: {
    x: cannonball.position.x + cannonball.velocity.x.current * deltaSeconds,
    y: cannonball.position.y + cannonball.velocity.y.current * deltaSeconds,
  },
});
