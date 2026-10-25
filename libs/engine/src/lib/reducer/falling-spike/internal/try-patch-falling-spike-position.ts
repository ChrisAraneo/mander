import { type FallingSpike, GRAVITY, type Level } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { computeVerticalMove } from '../../collision/compute-vertical-move';
import {
  FALLING_SPIKE_HEIGHT,
  FALLING_SPIKE_INSET_X,
  FALLING_SPIKE_WIDTH,
} from '../consts';
import { tryGetFallingSpikeInLevel } from './try-get-falling-spike-in-level';

export const tryPatchFallingSpikePosition = (
  level: Level,
  spike: FallingSpike,
  deltaSeconds: number,
): FallingSpike | null =>
  pipe(
    Math.min(
      spike.velocity.y.current + GRAVITY * deltaSeconds,
      spike.velocity.y.max,
    ),
    (velocityY) => ({
      velocityY,
      vertical: computeVerticalMove(
        level,
        spike.position.x + FALLING_SPIKE_INSET_X,
        spike.position.y,
        FALLING_SPIKE_WIDTH,
        FALLING_SPIKE_HEIGHT,
        velocityY * deltaSeconds,
      ),
    }),
    ({ velocityY, vertical }): FallingSpike | null =>
      match(vertical.isBlocked)
        .with(true, (): FallingSpike | null => null)
        .otherwise((): FallingSpike | null =>
          tryGetFallingSpikeInLevel(level, {
            position: { ...spike.position, y: vertical.position },
            velocity: { y: { ...spike.velocity.y, current: velocityY } },
            statuses: { isFalling: true },
          }),
        ),
  );
