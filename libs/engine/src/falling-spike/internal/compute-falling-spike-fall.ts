import { type FallingSpike, GRAVITY, type Level } from '@mander/model';
import type { FallingSpikeFall } from './types/falling-spike-fall';

export const computeFallingSpikeFall = ({
  level,
  spike,
  deltaSeconds,
}: {
  level: Level;
  spike: FallingSpike;
  deltaSeconds: number;
}): FallingSpikeFall => ({
  level,
  spike,
  deltaSeconds,
  velocityY: Math.min(
    spike.velocity.y.current + GRAVITY * deltaSeconds,
    spike.velocity.y.max,
  ),
});
