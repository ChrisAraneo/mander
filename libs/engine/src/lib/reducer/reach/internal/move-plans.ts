import { filter, flatMap, map } from 'lodash-es';
import { JUMP_HOLD_FRAMES } from '../consts';
import type { MovePlan } from './types/move-plan';

const DIRECTIONS: (1 | 0 | -1)[] = [-1, 0, 1];

export const MOVE_PLANS: readonly MovePlan[] = Object.freeze(
  filter(
    flatMap(DIRECTIONS, (direction) =>
      map(JUMP_HOLD_FRAMES, (jumpFrames): MovePlan => ({
        direction,
        jumpFrames,
      })),
    ),
    (plan) => plan.direction !== 0 || plan.jumpFrames > 0,
  ),
);
