import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createContextStyleStep } from './create-context-style-step';
import { createLinearGradient } from './create-linear-gradient';

describe('createContextStyleStep', () => {
  it('should build the style from the canvas and then set it when the style needs a gradient', () => {
    const calls = drawRecorded(
      createContextStyleStep((context) => ({
        fillStyle: createLinearGradient(context, 0, 0, 0, 8, [[0, '#000']]),
      })),
    );

    expect(calls).toEqual([
      'createLinearGradient(0, 0, 0, 8)',
      'addColorStop(0, #000)',
      'set fillStyle(gradient)',
    ]);
  });

  it('should set a plain colour when the style needs no gradient', () => {
    const calls = drawRecorded(
      createContextStyleStep(() => ({ strokeStyle: '#ABC' })),
    );

    expect(calls).toEqual(['set strokeStyle(#ABC)']);
  });
});
