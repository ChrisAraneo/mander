import type { Fireball, Player } from '@mander/model';
import { some } from 'lodash-es';
import { match } from 'ts-pattern';
import { isIceball } from './is-iceball';
import { isTouchingFireball } from './is-touching-fireball';

export const isBurning = (player: Player, fireballs: Fireball[]): boolean =>
  match(player.timers.invincibility <= 0)
    .with(true, () =>
      some(
        fireballs,
        (fireball) =>
          !isIceball(fireball) && isTouchingFireball(player, fireball),
      ),
    )
    .otherwise(() => false);
