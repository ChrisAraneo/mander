import { computeVerticalMove } from '../../collision/compute-vertical-move';
import {
  FALLING_SPIKE_HEIGHT,
  FALLING_SPIKE_INSET_X,
  FALLING_SPIKE_WIDTH,
} from '../consts';
import type { FallingSpikeDrop } from './types/falling-spike-drop';
import type { FallingSpikeFall } from './types/falling-spike-fall';

export const computeFallingSpikeDrop = ({
  level,
  spike,
  deltaSeconds,
  velocityY,
}: FallingSpikeFall): FallingSpikeDrop => ({
  level,
  spike,
  velocityY,
  vertical: computeVerticalMove(
    level,
    spike.position.x + FALLING_SPIKE_INSET_X,
    spike.position.y,
    FALLING_SPIKE_WIDTH,
    FALLING_SPIKE_HEIGHT,
    velocityY * deltaSeconds,
  ),
});
