import { describe, expect, it } from 'vitest';

import { computeCanvasHeightChange } from './compute-canvas-height-change';

const createTestCanvas = (width: number, height: number): HTMLCanvasElement =>
  ({ width, height }) as unknown as HTMLCanvasElement;

describe('computeCanvasHeightChange', () => {
  it('should ask for the new height when the height differs', () => {
    const result = computeCanvasHeightChange(createTestCanvas(100, 50), 80);

    expect(result).toEqual({ height: 80 });
  });

  it('should ask for nothing when the height already matches', () => {
    const result = computeCanvasHeightChange(createTestCanvas(100, 50), 50);

    expect(result).toEqual({});
  });
});
