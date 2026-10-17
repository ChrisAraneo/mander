import { describe, expect, it } from 'vitest';

import type { InputState } from '../../../types/input-state';
import { toHorizontalDirection } from './to-horizontal-direction';

const createInput = (isLeft: boolean, isRight: boolean): InputState => ({
  isLeft,
  isRight,
  isJump: false,
});

describe('toHorizontalDirection', () => {
  it('should point right when the player holds only right', () => {
    const direction = toHorizontalDirection(createInput(false, true));

    expect(direction).toBe(1);
  });

  it('should point left when the player holds only left', () => {
    const direction = toHorizontalDirection(createInput(true, false));

    expect(direction).toBe(-1);
  });

  it('should point nowhere when the player holds both left and right', () => {
    const direction = toHorizontalDirection(createInput(true, true));

    expect(direction).toBe(0);
  });

  it('should point nowhere when the player holds neither left nor right', () => {
    const direction = toHorizontalDirection(createInput(false, false));

    expect(direction).toBe(0);
  });
});
