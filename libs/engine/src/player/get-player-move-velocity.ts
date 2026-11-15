import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import { COLD_MOVE_FACTOR } from './consts';
import { isCold } from './is-cold';

export const getPlayerMoveVelocity = (player: Player): number =>
  match(isCold(player))
    .with(true, () => player.velocity.x.max * COLD_MOVE_FACTOR)
    .otherwise(() => player.velocity.x.max);
