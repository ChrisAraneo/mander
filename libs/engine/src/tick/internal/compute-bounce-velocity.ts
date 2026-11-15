import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import { STOMP_BOUNCE_VELOCITY } from '../../player/consts';

export const computeBounceVelocity = (
  player: Player,
  isJumpHeld: boolean,
): number =>
  match(isJumpHeld)
    .with(true, () => -player.velocity.y.max)
    .otherwise(() => -STOMP_BOUNCE_VELOCITY);
