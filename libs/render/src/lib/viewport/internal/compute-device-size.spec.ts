import { describe, expect, it } from 'vitest';

import { computeDeviceSize } from './compute-device-size';

const createTestCanvas = (
  clientWidth: number,
  clientHeight: number,
): HTMLCanvasElement =>
  ({ clientWidth, clientHeight }) as unknown as HTMLCanvasElement;

describe('computeDeviceSize', () => {
  it('should give the shown size in device pixels when the screen packs two pixels per point', () => {
    const result = computeDeviceSize(createTestCanvas(480, 240), 2);

    expect(result).toEqual({ width: 960, height: 480 });
  });

  it('should round to whole device pixels when the pixel ratio is a fraction', () => {
    const result = computeDeviceSize(createTestCanvas(101, 33), 1.5);

    expect(result).toEqual({ width: 152, height: 50 });
  });

  it('should keep at least one point on each side when the canvas is not shown', () => {
    const result = computeDeviceSize(createTestCanvas(0, 0), 3);

    expect(result).toEqual({ width: 3, height: 3 });
  });
});
