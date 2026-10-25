import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from './create-canvas-cell';

describe('createCanvasCell', () => {
  it('should keep the canvas it is given when it creates the cell', () => {
    const canvas = ref<HTMLCanvasElement | null>(null);

    expect(createCanvasCell(canvas).canvas).toBe(canvas);
  });

  it('should hold no drawing context when the cell is new', () => {
    expect(createCanvasCell(ref(null)).context.value).toBeNull();
  });
});
