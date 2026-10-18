import { describe, expect, it } from 'vitest';

import { computeCanvasWidthChange } from './compute-canvas-width-change';

const createTestCanvas = (width: number, height: number): HTMLCanvasElement =>
  ({ width, height }) as unknown as HTMLCanvasElement;

describe('computeCanvasWidthChange', () => {
  it('should ask for the new width when the width differs', () => {
    const result = computeCanvasWidthChange(createTestCanvas(100, 50), 200);

    expect(result).toEqual({ width: 200 });
  });

  it('should ask for nothing when the width already matches', () => {
    const result = computeCanvasWidthChange(createTestCanvas(100, 50), 100);

    expect(result).toEqual({});
  });
});
