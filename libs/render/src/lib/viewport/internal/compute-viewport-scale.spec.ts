import { describe, expect, it } from 'vitest';

import { computeViewportScale } from './compute-viewport-scale';

const createTestCanvas = (
  clientWidth: number,
  clientHeight: number,
): HTMLCanvasElement =>
  ({ clientWidth, clientHeight }) as unknown as HTMLCanvasElement;

describe('computeViewportScale', () => {
  it('should give a scale of one when the canvas shows the view at its own size', () => {
    const result = computeViewportScale(createTestCanvas(960, 480), 1);

    expect(result).toBe(1);
  });

  it('should fit the narrower side when the canvas is taller than the view', () => {
    const result = computeViewportScale(createTestCanvas(480, 960), 1);

    expect(result).toBe(0.5);
  });

  it('should grow with the pixel ratio when the screen packs more pixels per point', () => {
    const result = computeViewportScale(createTestCanvas(960, 480), 2);

    expect(result).toBe(2);
  });
});
