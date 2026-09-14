import { describe, expect, it } from 'vitest';

import { getCameraAxis } from './get-camera-axis';

const VIEW = 960;

const SCALE = 1;

describe('getCameraAxis', () => {
  it('holds the camera at the near edge until the focus has moved off it', () => {
    expect(getCameraAxis(0, VIEW, 4480, SCALE)).toBe(0);
    expect(getCameraAxis(400, VIEW, 4480, SCALE)).toBe(0);
  });

  it('carries the camera along with the focus once it is under way', () => {
    expect(getCameraAxis(1200, VIEW, 4480, SCALE)).toBe(720);
  });

  it('holds the camera at the far edge at the end of the level', () => {
    expect(getCameraAxis(4480, VIEW, 4480, SCALE)).toBe(4480 - VIEW);
  });

  it('centres a level that is narrower than the view instead of pinning it left', () => {
    expect(getCameraAxis(320, VIEW, 640, SCALE)).toBe((640 - VIEW) / 2);
  });

  it('centres such a level wherever the focus happens to be', () => {
    expect(getCameraAxis(0, VIEW, 640, SCALE)).toBe(
      getCameraAxis(640, VIEW, 640, SCALE),
    );
  });

  it('holds such a level still even where the focus has left it altogether', () => {
    expect(getCameraAxis(-200, VIEW, 640, SCALE)).toBe((640 - VIEW) / 2);
    expect(getCameraAxis(840, VIEW, 640, SCALE)).toBe((640 - VIEW) / 2);
  });

  it('leaves the camera on a device pixel', () => {
    expect(getCameraAxis(1237.4213, VIEW, 4480, 2)).toBe(
      Math.round((1237.4213 - VIEW / 2) * 2) / 2,
    );
  });
});
