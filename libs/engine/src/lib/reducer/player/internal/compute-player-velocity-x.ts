import type { Level, Player } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { computeWalkSpeed } from '../../sand/compute-walk-speed';
import {
  ACCELERATION_SECONDS,
  ICE_ACCELERATION_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../consts';
import { getPlayerMoveVelocity } from '../get-player-move-velocity';
import { computeRampedVelocityX } from './compute-ramped-velocity-x';
import { isOnIce } from './is-on-ice';

export const computePlayerVelocityX = (
  level: Level,
  player: Player,
  direction: number,
  deltaSeconds: number,
): number =>
  pipe(
    {
      moveVelocity: computeWalkSpeed(
        level,
        player,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        getPlayerMoveVelocity(player),
      ),
      accelerationSeconds: match(isOnIce(level, player))
        .with(true, () => ICE_ACCELERATION_SECONDS)
        .otherwise(() => ACCELERATION_SECONDS),
    },
    ({ moveVelocity, accelerationSeconds }) =>
      computeRampedVelocityX(
        player.velocity.x.current,
        direction * moveVelocity,
        (moveVelocity / accelerationSeconds) * deltaSeconds,
      ),
  );
