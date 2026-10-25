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
});
