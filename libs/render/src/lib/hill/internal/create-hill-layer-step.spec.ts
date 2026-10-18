import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { HILL_LAYERS } from '../consts';
import { createHillLayerStep } from './create-hill-layer-step';

describe('createHillLayerStep', () => {
  it('should fill the hill shape from the bottom of the view when it is given a layer and a view', () => {
    const calls = drawRecorded(
      createHillLayerStep(40, HILL_LAYERS[0], '#334455', {
        width: 48,
        height: 32,
        scale: 1,
      }),
    );

    expect(calls).toEqual([
      'set fillStyle(#334455)',
      'beginPath()',
      'moveTo(0, 32)',
      'lineTo(0, 15.8379)',
      'lineTo(16, 9.1732)',
      'lineTo(32, 2.6854)',
      'lineTo(48, -3.5128)',
      'lineTo(48, 32)',
      'closePath()',
      'fill()',
    ]);
  });
});
