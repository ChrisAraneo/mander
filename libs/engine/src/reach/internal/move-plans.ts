import { filter, flatMap, map } from 'lodash-es';
import { MAX_PLAN_FRAMES } from '../consts';
import type { MoveDirection } from './types/move-direction';
import type { MovePlan } from './types/move-plan';

const JUMP_HOLD_FRAMES: readonly number[] = Object.freeze([
  0,
  3,
  MAX_PLAN_FRAMES,
]);

const DIRECTIONS: readonly MoveDirection[] = Object.freeze([
  'LEFT',
  'NONE',
  'RIGHT',
]);

export const MOVE_PLANS: readonly MovePlan[] = Object.freeze(
  filter(
    flatMap(DIRECTIONS, (direction) =>
      map(JUMP_HOLD_FRAMES, (jumpFrames): MovePlan => ({
        direction,
        jumpFrames,
      })),
    ),
    (plan) => plan.direction !== 'NONE' || plan.jumpFrames > 0,
  ),
);
