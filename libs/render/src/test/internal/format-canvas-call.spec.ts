import { describe, expect, it } from 'vitest';

import { formatCanvasCall } from './format-canvas-call';

describe('formatCanvasCall', () => {
  it('should write the call with its arguments when the call has some', () => {
    const text = formatCanvasCall({
      name: 'arc',
      args: [0, 0, 6, 0, Math.PI * 2],
    });

    expect(text).toBe('arc(0, 0, 6, 0, 6.2832)');
  });

  it('should write empty brackets when the call has no arguments', () => {
    const text = formatCanvasCall({ name: 'fill', args: [] });

    expect(text).toBe('fill()');
  });
});
