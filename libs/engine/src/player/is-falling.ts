import type { Player } from '@mander/model';

const RESTING_SPEED = 0;

export const isFalling = (player: Player): boolean =>
  player.velocity.y.current > RESTING_SPEED;
