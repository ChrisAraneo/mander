import { describe, expect, it } from 'vitest';

import { computeCenteredCameraAxis } from './compute-centered-camera-axis';

describe('computeCenteredCameraAxis', () => {
  it('should move the camera before the level start when the level is narrower than the view', () => {
    const result = computeCenteredCameraAxis(960, 640);

    expect(result).toBe(-160);
  });

  it('should move the camera into the level when the level is wider than the view', () => {
    const result = computeCenteredCameraAxis(320, 640);

    expect(result).toBe(160);
  });
});
