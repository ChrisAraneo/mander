import { describe, expect, it } from 'vitest';

import { computeFrameDelta } from './compute-frame-delta';

describe('computeFrameDelta', () => {
  it('should give the time between two frames when the second comes later', () => {
    expect(computeFrameDelta([{ timestamp: 100 }, { timestamp: 116.5 }])).toBe(
      16.5,
    );
  });

  it('should give no time when both frames come at the same moment', () => {
    expect(computeFrameDelta([{ timestamp: 40 }, { timestamp: 40 }])).toBe(0);
  });
});
