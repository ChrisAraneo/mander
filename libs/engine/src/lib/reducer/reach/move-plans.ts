import { chain } from '@mander/utils';
import { map } from 'lodash-es';

import { JUMP_HOLD_FRAMES } from './consts';
import type { MovePlan } from './move-plan';

const DIRECTIONS: (1 | 0 | -1)[] = [-1, 0, 1];

export const MOVE_PLANS: MovePlan[] = chain(DIRECTIONS)
  .flatMap((direction) =>
    map(JUMP_HOLD_FRAMES, (jumpFrames): MovePlan => ({
      direction,
      jumpFrames,
    })),
  )
  .filter((plan) => plan.direction !== 0 || plan.jumpFrames > 0)
  .value();
