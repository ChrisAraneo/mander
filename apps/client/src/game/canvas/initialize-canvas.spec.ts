import { tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from './create-canvas-cell';
import { initializeCanvas } from './initialize-canvas';

const CONTEXT = { kind: 'CONTEXT' } as unknown as CanvasRenderingContext2D;

const createCanvas = (requests: unknown[]): HTMLCanvasElement =>
  ({
    getContext: (...request: unknown[]) =>
      tap(CONTEXT, () => requests.push(request)),
  }) as unknown as HTMLCanvasElement;

describe('initializeCanvas', () => {
  it('should keep the drawing context when the canvas is mounted', () => {
    const cell = createCanvasCell(ref(createCanvas([])));

    initializeCanvas(cell);

    expect(cell.context.value).toBe(CONTEXT);
  });

  it('should ask for an opaque flat context when the canvas is mounted', () => {
    const requests: unknown[] = [];

    initializeCanvas(createCanvasCell(ref(createCanvas(requests))));

    expect(requests).toEqual([['2d', { alpha: false }]]);
  });

  it('should give back the drawing context when the canvas is mounted', () => {
    expect(initializeCanvas(createCanvasCell(ref(createCanvas([]))))).toBe(
      CONTEXT,
    );
  });

  it('should hold no drawing context when the canvas is not mounted', () => {
    const cell = createCanvasCell(ref(null));

    expect(initializeCanvas(cell)).toBeNull();
    expect(cell.context.value).toBeNull();
  });
});
