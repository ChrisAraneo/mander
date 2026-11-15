import type { FallingSpike } from '@mander/model';

export const createDroppedFallingSpike = (
  spike: FallingSpike,
  velocityY: number,
  nextY: number,
): FallingSpike => ({
  position: { ...spike.position, y: nextY },
  velocity: { y: { ...spike.velocity.y, current: velocityY } },
  statuses: { isFalling: true },
});
