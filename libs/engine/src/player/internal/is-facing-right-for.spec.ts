import { describe, expect, it } from 'vitest';

import { isFacingRightFor } from './is-facing-right-for';

describe('isFacingRightFor', () => {
  it('should keep the player facing left when they do not move', () => {
    const isFacingRight = isFacingRightFor(0, false);

    expect(isFacingRight).toBe(false);
  });

  it('should keep the player facing right when they do not move', () => {
    const isFacingRight = isFacingRightFor(0, true);

    expect(isFacingRight).toBe(true);
  });

  it('should face the player right when they move right', () => {
    const isFacingRight = isFacingRightFor(1, false);

    expect(isFacingRight).toBe(true);
  });

  it('should face the player left when they move left', () => {
    const isFacingRight = isFacingRightFor(-1, true);

    expect(isFacingRight).toBe(false);
  });
});
