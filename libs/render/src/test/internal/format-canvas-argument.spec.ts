import { describe, expect, it } from 'vitest';

import { formatCanvasArgument } from './format-canvas-argument';

describe('formatCanvasArgument', () => {
  it('should round the number to four decimals when it is given a coordinate', () => {
    const text = formatCanvasArgument(Math.PI * 2);

    expect(text).toBe('6.2832');
  });

  it('should keep the colour as it is when it is given a style', () => {
    const text = formatCanvasArgument('#3FB53F');

    expect(text).toBe('#3FB53F');
  });

  it('should name the gradient when it is given something that is neither a number nor a colour', () => {
    const text = formatCanvasArgument({});

    expect(text).toBe('gradient');
  });
});
