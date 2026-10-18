import { describe, expect, it } from 'vitest';

import { computeCanvasSizeChange } from './compute-canvas-size-change';

const createTestCanvas = (width: number, height: number): HTMLCanvasElement =>
  ({ width, height }) as unknown as HTMLCanvasElement;

describe('computeCanvasSizeChange', () => {
  it('should ask for the new width when only the width differs', () => {
    const result = computeCanvasSizeChange(createTestCanvas(100, 50), {
      width: 200,
      height: 50,
    });

    expect(result).toEqual({ width: 200 });
  });

  it('should ask for the new height when only the height differs', () => {
    const result = computeCanvasSizeChange(createTestCanvas(100, 50), {
      width: 100,
      height: 80,
    });

    expect(result).toEqual({ height: 80 });
  });

  it('should ask for both sides when both differ', () => {
    const result = computeCanvasSizeChange(createTestCanvas(100, 50), {
      width: 200,
      height: 80,
    });

    expect(result).toEqual({ width: 200, height: 80 });
  });

  it('should ask for nothing when the size already matches', () => {
    const result = computeCanvasSizeChange(createTestCanvas(100, 50), {
      width: 100,
      height: 50,
    });

    expect(result).toEqual({});
  });
});
