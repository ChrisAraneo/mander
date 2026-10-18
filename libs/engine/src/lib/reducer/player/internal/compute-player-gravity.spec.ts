import { GRAVITY } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { InputState } from '../../../types/input-state';
import { computePlayerGravity } from './compute-player-gravity';

const NO_INPUT: InputState = { isLeft: false, isRight: false, isJump: false };

const JUMP_INPUT: InputState = { isLeft: false, isRight: false, isJump: true };

describe('computePlayerGravity', () => {
  it('should pull the player down harder when they rise without holding jump', () => {
    const gravity = computePlayerGravity(-100, NO_INPUT);

    expect(gravity).toBeCloseTo(GRAVITY * 2.6, 6);
  });

  it('should pull the player down normally when they rise while holding jump', () => {
    const gravity = computePlayerGravity(-100, JUMP_INPUT);

    expect(gravity).toBe(GRAVITY);
  });

  it('should pull the player down normally when they fall', () => {
    const gravity = computePlayerGravity(100, NO_INPUT);

    expect(gravity).toBe(GRAVITY);
  });

  it('should pull the player down normally when they stand still', () => {
    const gravity = computePlayerGravity(0, NO_INPUT);

    expect(gravity).toBe(GRAVITY);
  });
});
