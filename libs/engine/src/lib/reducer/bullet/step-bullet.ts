import type { Bullet } from '@mander/model';

export const stepBullet = (bullet: Bullet, deltaSeconds: number): Bullet => ({
  ...bullet,
  position: {
    ...bullet.position,
    x: bullet.position.x + bullet.velocity.x.current * deltaSeconds,
  },
});
