import { describe, expect, it } from 'vitest';

import { getActionCode } from './get-action-code';

describe('getActionCode', () => {
  it('should give zero when the action is starting to move left', () => {
    const code = getActionCode('MOVE_LEFT_START');

    expect(code).toBe(0);
  });

  it('should give seven when the action is choosing an item', () => {
    const code = getActionCode('CHOOSE_ITEM');

    expect(code).toBe(7);
  });

  it('should give fourteen when the action is toggling the moon magnet', () => {
    const code = getActionCode('TOGGLE_MOON_MAGNET');

    expect(code).toBe(14);
  });
});
