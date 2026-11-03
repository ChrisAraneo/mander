import type { LightingPass } from '@mander/render';
import { noop, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { closeCanvas } from './close-canvas';
import { createCanvasCell } from './create-canvas-cell';

describe('closeCanvas', () => {
  it('should let go of the drawing context when it closes the canvas', () => {
    const cell = createCanvasCell(ref(null));
    cell.context.value = {} as unknown as CanvasRenderingContext2D;

    closeCanvas(cell);

    expect(cell.context.value).toBeNull();
  });

  it('should release the lighting and let go of it when it closes the canvas', () => {
    const released: string[] = [];
    const cell = createCanvasCell(ref(null));
    cell.lighting.value = {
      gl: {
        getExtension: (name: string) =>
          tap({ loseContext: noop }, () => released.push(name)),
      },
    } as unknown as LightingPass;

    closeCanvas(cell);

    expect(released).toEqual(['WEBGL_lose_context']);
    expect(cell.lighting.value).toBeUndefined();
  });

  it('should close without trouble when the canvas never had lighting', () => {
    expect(closeCanvas(createCanvasCell(ref(null)))).toBeNull();
  });
});
