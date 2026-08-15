import type { InputState } from '../../state/types/input-state';
import type { MovePlan } from './types/move-plan';

export const planInput = (plan: MovePlan, frame: number): InputState => ({
  isLeft: plan.direction < 0,
  isRight: plan.direction > 0,
  isJump: frame < plan.jumpFrames,
});
