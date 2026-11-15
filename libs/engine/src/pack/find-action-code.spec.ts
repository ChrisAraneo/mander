import { describe, expect, it } from 'vitest';

import { findActionCode } from './find-action-code';

describe('findActionCode', () => {
  it('should give zero when the action is starting to move left', () => {
    const code = findActionCode('MOVE_LEFT_START');

    expect(code).toBe(0);
  });

  it('should give seven when the action is choosing an item', () => {
    const code = findActionCode('CHOOSE_ITEM');

    expect(code).toBe(7);
  });

  it('should give thirteen when the action is shooting', () => {
    const code = findActionCode('SHOOT');

    expect(code).toBe(13);
  });
});
