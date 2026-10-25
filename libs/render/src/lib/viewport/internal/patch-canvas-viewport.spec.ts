import { describe, expect, it } from 'vitest';

import { patchCanvasViewport } from './patch-canvas-viewport';

const createTestCanvas = (
  clientWidth: number,
  clientHeight: number,
): HTMLCanvasElement =>
  ({
    clientWidth,
    clientHeight,
    width: 300,
    height: 150,
  }) as unknown as HTMLCanvasElement;

describe('patchCanvasViewport', () => {
  it('should resize the canvas to its device pixels when it is shown at a new size', () => {
    const canvas = createTestCanvas(480, 240);

    patchCanvasViewport(canvas, 2);

    expect(canvas.width).toBe(960);
    expect(canvas.height).toBe(480);
  });

  it('should give the view in world units when the canvas is scaled up', () => {
    const result = patchCanvasViewport(createTestCanvas(960, 480), 2);

    expect(result).toEqual({ width: 960, height: 480, scale: 2 });
  });

  it('should show more of the world when the canvas is wider than the view', () => {
    const result = patchCanvasViewport(createTestCanvas(1920, 480), 1);

    expect(result).toEqual({ width: 1920, height: 480, scale: 1 });
  });
});
