import type { Player } from '@mander/model';
import { match } from 'ts-pattern';

const STRIDE_MIN_SPEED = 1;

const STRIDE_SPEED = 14;

const STRIDE_SWING = 5;

export const computePlayerSwing = (player: Player, time: number): number =>
  match(
    Math.abs(player.velocity.x.current) > STRIDE_MIN_SPEED &&
      player.statuses.isGrounded,
  )
    .with(true, () => Math.sin(time * STRIDE_SPEED) * STRIDE_SWING)
    .otherwise(() => 0);
