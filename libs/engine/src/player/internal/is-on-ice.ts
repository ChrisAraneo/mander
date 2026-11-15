import type { Level, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { isStandingOnIce } from './is-standing-on-ice';

export const isOnIce = (level: Level, player: Player): boolean =>
  match(player.statuses.isGrounded)
    .with(false, () => false)
    .otherwise(() => isStandingOnIce(level, player));
