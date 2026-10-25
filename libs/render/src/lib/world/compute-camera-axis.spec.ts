import { round } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeCameraAxis } from './compute-camera-axis';

const VIEW = 960;

const SCALE = 1;

describe('computeCameraAxis', () => {
  it('should hold the camera at the near edge when the focus has not moved off it', () => {
    expect(computeCameraAxis(0, VIEW, 4480, SCALE)).toBe(0);
    expect(computeCameraAxis(400, VIEW, 4480, SCALE)).toBe(0);
  });

  it('should carry the camera along with the focus when it is under way', () => {
    expect(computeCameraAxis(1200, VIEW, 4480, SCALE)).toBe(720);
  });

  it('should hold the camera at the far edge when the focus reaches the end of the level', () => {
    expect(computeCameraAxis(4480, VIEW, 4480, SCALE)).toBe(4480 - VIEW);
  });

  it('should centre the level rather than pin it left when it is narrower than the view', () => {
    expect(computeCameraAxis(320, VIEW, 640, SCALE)).toBe((640 - VIEW) / 2);
  });

  it('should centre the level the same wherever the focus happens to be when it is narrower than the view', () => {
    expect(computeCameraAxis(0, VIEW, 640, SCALE)).toBe(
      computeCameraAxis(640, VIEW, 640, SCALE),
    );
  });

  it('should hold the level still when the focus has left it altogether', () => {
    expect(computeCameraAxis(-200, VIEW, 640, SCALE)).toBe((640 - VIEW) / 2);
    expect(computeCameraAxis(840, VIEW, 640, SCALE)).toBe((640 - VIEW) / 2);
  });

  it('should leave the camera on a device pixel when the focus falls between two', () => {
    expect(computeCameraAxis(1237.4213, VIEW, 4480, 2)).toBe(
      round((1237.4213 - VIEW / 2) * 2) / 2,
    );
  });
});
