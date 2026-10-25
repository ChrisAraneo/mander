import { describe, expect, it } from 'vitest';

import { createTicks } from './create-ticks';

describe('createTicks', () => {
  it('should give one tick for each step of the pulse', () => {
    expect(createTicks({ steps: 3, alpha: 0.5 })).toEqual([
      { type: 'TICK' },
      { type: 'TICK' },
      { type: 'TICK' },
    ]);
  });

  it('should give no ticks when the pulse has no steps', () => {
    expect(createTicks({ steps: 0, alpha: 0.5 })).toEqual([]);
  });
});
