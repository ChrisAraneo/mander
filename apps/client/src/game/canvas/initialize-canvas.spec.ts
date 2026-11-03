import { noop, tap } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from './create-canvas-cell';
import { initializeCanvas } from './initialize-canvas';

const CONTEXT = { kind: 'CONTEXT' } as unknown as CanvasRenderingContext2D;

const LIGHT_CANVAS = { getContext: () => null };

const createCanvas = (requests: unknown[]): HTMLCanvasElement =>
  ({
    getContext: (...request: unknown[]) =>
      tap(CONTEXT, () => requests.push(request)),
    ownerDocument: { createElement: () => LIGHT_CANVAS },
  }) as unknown as HTMLCanvasElement;

const createGlStub = (): unknown =>
  new Proxy(
    {},
    {
      get: (_, name) =>
        match(name)
          .with('getProgramParameter', () => () => true)
          .with('createProgram', () => () => ({}))
          .otherwise(() => noop),
    },
  );

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

  it('should go without lighting when the browser cannot run the shaders', () => {
    const cell = createCanvasCell(ref(createCanvas([])));

    initializeCanvas(cell);

    expect(cell.lighting.value).toBeUndefined();
  });

  it('should keep the lighting pass when the browser can run the shaders', () => {
    const light = { getContext: createGlStub };
    const cell = createCanvasCell(
      ref({
        getContext: () => CONTEXT,
        ownerDocument: { createElement: () => light },
      } as unknown as HTMLCanvasElement),
    );

    initializeCanvas(cell);

    expect(cell.lighting.value?.canvas).toBe(light);
  });

  it('should hold no drawing context when the canvas is not mounted', () => {
    const cell = createCanvasCell(ref(null));

    expect(initializeCanvas(cell)).toBeNull();
    expect(cell.context.value).toBeNull();
  });
});
