import type { Cannonball, Player } from '@mander/model';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';

import { isTouchingCannonball } from './is-touching-cannonball';

export const strikingCannonballs = (
  player: Player,
  cannonballs: Cannonball[],
): Cannonball[] =>
  match(player.timers.invincibility <= 0)
    .with(true, () =>
      filter(cannonballs, (cannonball) =>
        isTouchingCannonball(player, cannonball),
      ),
    )
    .otherwise((): Cannonball[] => []);
