import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import { STOMP_BOUNCE_VELOCITY } from '../../player/consts';

export const computeBounceVelocity = (
  isJumpHeld: boolean,
  player: Player,
): number =>
  match(isJumpHeld)
    .with(true, () => -player.velocity.y.max)
    .otherwise(() => -STOMP_BOUNCE_VELOCITY);
