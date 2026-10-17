import { describe, expect, it } from 'vitest';

import { toPlanInput } from './to-plan-input';

describe('toPlanInput', () => {
  it('should press left and jump when the plan moves left and the jump is still held', () => {
    const input = toPlanInput({ direction: -1, jumpFrames: 3 }, 2);

    expect(input).toEqual({ isLeft: true, isRight: false, isJump: true });
  });

  it('should press right without jumping when the plan moves right and the jump hold is over', () => {
    const input = toPlanInput({ direction: 1, jumpFrames: 3 }, 3);

    expect(input).toEqual({ isLeft: false, isRight: true, isJump: false });
  });

  it('should press nothing when the plan stands still without a jump', () => {
    const input = toPlanInput({ direction: 0, jumpFrames: 0 }, 0);

    expect(input).toEqual({ isLeft: false, isRight: false, isJump: false });
  });
});
