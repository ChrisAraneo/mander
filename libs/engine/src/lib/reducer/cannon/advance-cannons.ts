import type { Cannon, Player } from '@mander/model';
import { chain } from '@mander/utils';
import { compact, map } from 'lodash-es';
import { match } from 'ts-pattern';

import { CANNON_RELOAD_SECONDS } from './consts';
import { fireCannonball } from './fire-cannonball';
import { isPlayerInRange } from './is-player-in-range';
import { isPlayerRightOf } from './is-player-right-of';
import type { Barrage } from './types/barrage';
import type { Shot } from './types/shot';

const aim = (cannon: Cannon, player: Player): Cannon => ({
  ...cannon,
  statuses: { isFacingRight: isPlayerRightOf(cannon, player) },
});

const cool = (cannon: Cannon, deltaSeconds: number): Cannon => ({
  ...cannon,
  timers: { reload: cannon.timers.reload - deltaSeconds },
});

const holdFire = (cannon: Cannon): Shot => ({ cannon, cannonball: null });

const shoot = (cannon: Cannon): Shot =>
  match(cannon.timers.reload <= 0)
    .with(true, (): Shot => ({
      cannon: {
        ...cannon,
        timers: { reload: cannon.timers.reload + CANNON_RELOAD_SECONDS },
      },
      cannonball: fireCannonball(cannon),
    }))
    .otherwise(() => holdFire(cannon));

const advance = (cannon: Cannon, player: Player, deltaSeconds: number): Shot =>
  match(isPlayerInRange(cannon, player))
    .with(true, () => shoot(cool(cannon, deltaSeconds)))
    .otherwise(() => holdFire(cannon));

export const advanceCannons = (
  cannons: Cannon[],
  player: Player,
  deltaSeconds: number,
): Barrage =>
  chain(cannons)
    .thru((mounted) =>
      map(mounted, (cannon) =>
        advance(aim(cannon, player), player, deltaSeconds),
      ),
    )
    .thru((shots): Barrage => ({
      cannons: map(shots, (shot) => shot.cannon),
      cannonballs: compact(map(shots, (shot) => shot.cannonball)),
    }))
    .value();
