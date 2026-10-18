import { describe, expect, it } from 'vitest';

import { resizeCanvas } from './resize-canvas';

const createTestCanvas = (width: number, height: number): HTMLCanvasElement =>
  ({ width, height }) as unknown as HTMLCanvasElement;

describe('resizeCanvas', () => {
  it('should give the canvas the new size when both sides change', () => {
    const canvas = createTestCanvas(100, 50);

    const result = resizeCanvas(canvas, { width: 200, height: 80 });

    expect(result).toBe(canvas);
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(80);
  });

  it('should keep the size when the canvas already has it', () => {
    const canvas = createTestCanvas(100, 50);

    const result = resizeCanvas(canvas, { width: 100, height: 50 });

    expect(result).toBe(canvas);
    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(50);
  });

  it('should change only the height when only the height differs', () => {
    const canvas = createTestCanvas(100, 50);

    resizeCanvas(canvas, { width: 100, height: 70 });

    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(70);
  });
});
