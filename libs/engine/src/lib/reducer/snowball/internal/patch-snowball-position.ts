import type { Snowball } from '@mander/model';

export const patchSnowballPosition = (
  snowball: Snowball,
  deltaSeconds: number,
): Snowball => ({
  ...snowball,
  position: {
    ...snowball.position,
    x: snowball.position.x + snowball.velocity.x.current * deltaSeconds,
  },
});
