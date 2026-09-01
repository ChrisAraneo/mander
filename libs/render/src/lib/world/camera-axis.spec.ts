import { describe, expect, it } from 'vitest';

import { cameraAxis } from './camera-axis';

const VIEW = 960;

const SCALE = 1;

describe('cameraAxis', () => {
  it('holds the camera at the near edge until the focus has moved off it', () => {
    expect(cameraAxis(0, VIEW, 4480, SCALE)).toBe(0);
    expect(cameraAxis(400, VIEW, 4480, SCALE)).toBe(0);
  });

  it('carries the camera along with the focus once it is under way', () => {
    expect(cameraAxis(1200, VIEW, 4480, SCALE)).toBe(720);
  });

  it('holds the camera at the far edge at the end of the level', () => {
    expect(cameraAxis(4480, VIEW, 4480, SCALE)).toBe(4480 - VIEW);
  });

  it('centres a level that is narrower than the view instead of pinning it left', () => {
    expect(cameraAxis(320, VIEW, 640, SCALE)).toBe((640 - VIEW) / 2);
  });

  it('centres such a level wherever the focus happens to be', () => {
    expect(cameraAxis(0, VIEW, 640, SCALE)).toBe(
      cameraAxis(640, VIEW, 640, SCALE),
    );
  });

  it('leaves the camera on a device pixel', () => {
    expect(cameraAxis(1237.4213, VIEW, 4480, 2)).toBe(
      Math.round((1237.4213 - VIEW / 2) * 2) / 2,
    );
  });
});
