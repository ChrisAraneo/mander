import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { patchCanvas } from './patch-canvas';

const createCanvas = (context: unknown): HTMLCanvasElement =>
  ({
    width: 0,
    height: 0,
    style: {},
    getContext: constant(context),
  }) as unknown as HTMLCanvasElement;

describe('patchCanvas', () => {
  it('should size the backing store by the pixel ratio and the box in css pixels when it fits the canvas', () => {
    const transforms: unknown[][] = [];
    const context = {
      setTransform: (...args: unknown[]): number => transforms.push(args),
    };
    const canvas = createCanvas(context);

    const patched = patchCanvas(canvas, 100, 50, 1.5);

    expect(patched).toBe(context);
    expect(canvas.width).toBe(150);
    expect(canvas.height).toBe(75);
    expect(canvas.style).toEqual({ width: '100px', height: '50px' });
    expect(transforms).toEqual([[1.5, 0, 0, 1.5, 0, 0]]);
  });

  it('should give no context when the canvas cannot draw in two dimensions', () => {
    expect(patchCanvas(createCanvas(null), 100, 50, 1)).toBeNull();
  });
});
