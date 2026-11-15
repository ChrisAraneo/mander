import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import { COLD_JUMP_VELOCITY_FACTOR } from './consts';
import { isCold } from './is-cold';

export const getPlayerJumpVelocity = (player: Player): number =>
  match(isCold(player))
    .with(true, () => player.velocity.y.max * COLD_JUMP_VELOCITY_FACTOR)
    .otherwise(() => player.velocity.y.max);
