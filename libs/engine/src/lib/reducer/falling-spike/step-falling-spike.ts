import {
  type FallingSpike,
  GRAVITY,
  type Level,
  MAX_TICK_SECONDS,
  type Player,
} from '@mander/model';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import { moveVertical } from '../collision/move-vertical';
import {
  FALLING_SPIKE_HEIGHT,
  FALLING_SPIKE_INSET_X,
  FALLING_SPIKE_WIDTH,
} from './consts';
import { hasLeftLevel } from './has-left-level';
import { isPlayerInRange } from './is-player-in-range';

const keptInLevel = (level: Level, spike: FallingSpike): FallingSpike | null =>
  match(hasLeftLevel(level, spike))
    .with(true, (): FallingSpike | null => null)
    .otherwise((): FallingSpike | null => spike);

const fall = (
  level: Level,
  spike: FallingSpike,
  deltaSeconds: number,
): FallingSpike | null =>
  chain(
    Math.min(
      spike.velocity.y.current + GRAVITY * deltaSeconds,
      spike.velocity.y.max,
    ),
  )
    .thru((vy) => ({
      vy,
      vertical: moveVertical(
        level,
        spike.position.x + FALLING_SPIKE_INSET_X,
        spike.position.y,
        FALLING_SPIKE_WIDTH,
        FALLING_SPIKE_HEIGHT,
        vy * deltaSeconds,
      ),
    }))
    .thru(({ vy, vertical }): FallingSpike | null =>
      match(vertical.isBlocked)
        .with(true, (): FallingSpike | null => null)
        .otherwise((): FallingSpike | null =>
          keptInLevel(level, {
            position: { ...spike.position, y: vertical.position },
            velocity: { y: { ...spike.velocity.y, current: vy } },
            statuses: { isFalling: true },
          }),
        ),
    )
    .value();

export const stepFallingSpike = (
  level: Level,
  spike: FallingSpike,
  player: Player,
  elapsedSeconds: number,
): FallingSpike | null =>
  match(spike.statuses.isFalling || isPlayerInRange(spike, player))
    .with(true, (): FallingSpike | null =>
      fall(level, spike, Math.min(elapsedSeconds, MAX_TICK_SECONDS)),
    )
    .otherwise((): FallingSpike | null => spike);
