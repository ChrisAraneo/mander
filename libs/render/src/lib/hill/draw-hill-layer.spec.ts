import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import type { Viewport } from '../types/viewport';
import { HILL_LAYERS } from './consts';
import { drawHillLayer } from './draw-hill-layer';

const VIEWPORT: Viewport = { width: 64, height: 48, scale: 1 };

describe('drawHillLayer', () => {
  it('should draw the far hills along the bottom of the view when the camera has not moved', () => {
    const calls = drawRecorded((context) =>
      drawHillLayer(context, 0, HILL_LAYERS[0], '#334455', VIEWPORT),
    );

    expect(calls).toEqual([
      'set fillStyle(#334455)',
      'beginPath()',
      'moveTo(0, 48)',
      'lineTo(0, 28.8)',
      'lineTo(16, 22.0907)',
      'lineTo(32, 15.5)',
      'lineTo(48, 9.1433)',
      'lineTo(64, 3.13)',
      'lineTo(64, 48)',
      'closePath()',
      'fill()',
    ]);
  });

  it('should slide the near hills sideways when the camera has moved on', () => {
    const calls = drawRecorded((context) =>
      drawHillLayer(context, 100, HILL_LAYERS[1], '#223344', VIEWPORT),
    );

    expect(calls).toEqual([
      'set fillStyle(#223344)',
      'beginPath()',
      'moveTo(0, 48)',
      'lineTo(0, 13.8894)',
      'lineTo(16, 6.2161)',
      'lineTo(32, -0.9206)',
      'lineTo(48, -7.4059)',
      'lineTo(64, -13.1419)',
      'lineTo(64, 48)',
      'closePath()',
      'fill()',
    ]);
  });
});
