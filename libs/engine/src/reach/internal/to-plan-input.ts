import type { InputState } from '../../state/types/input-state';
import type { MovePlan } from './types/move-plan';

export const toPlanInput = (plan: MovePlan, frame: number): InputState => ({
  isLeft: plan.direction === 'LEFT',
  isRight: plan.direction === 'RIGHT',
  isJump: frame < plan.jumpFrames,
});
