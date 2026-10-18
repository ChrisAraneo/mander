import { describe, expect, it } from 'vitest';

import { computeFollowingCameraAxis } from './compute-following-camera-axis';

describe('computeFollowingCameraAxis', () => {
  it('should keep the focus in the middle of the view when the focus is well inside the level', () => {
    const result = computeFollowingCameraAxis(1200, 960, 4480);

    expect(result).toBe(720);
  });

  it('should stop at the start of the level when the focus is near the start', () => {
    const result = computeFollowingCameraAxis(100, 960, 4480);

    expect(result).toBe(0);
  });

  it('should stop at the end of the level when the focus is near the end', () => {
    const result = computeFollowingCameraAxis(4480, 960, 4480);

    expect(result).toBe(3520);
  });
});
