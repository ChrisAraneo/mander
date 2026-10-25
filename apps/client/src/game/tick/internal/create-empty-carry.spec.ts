import { describe, expect, it } from 'vitest';

import { createEmptyCarry } from './create-empty-carry';

describe('createEmptyCarry', () => {
  it('should carry no time and no steps when the clock starts', () => {
    expect(createEmptyCarry()).toEqual({ carryMs: 0, steps: 0 });
  });

  it('should give a new carry each time when it is called again', () => {
    expect(createEmptyCarry()).not.toBe(createEmptyCarry());
  });
});
