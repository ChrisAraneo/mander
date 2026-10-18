import type { Rectangle } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createPortalRingsStep } from './create-portal-rings-step';

const PORTAL: Rectangle = { x: 100, y: 20, width: 28, height: 44 };

describe('createPortalRingsStep', () => {
  it('should draw three rings spread evenly round the core when the clock is at zero', () => {
    const calls = drawRecorded(createPortalRingsStep(PORTAL, 114, 42, 1, 0));

    expect(calls).toEqual([
      'set strokeStyle(#B98CFF)',
      'set lineWidth(3)',
      'beginPath()',
      'ellipse(114, 42, 10, 16, 0, 0, 1.885)',
      'stroke()',
      'beginPath()',
      'ellipse(114, 42, 10, 16, 0, 2.0944, 3.9794)',
      'stroke()',
      'beginPath()',
      'ellipse(114, 42, 10, 16, 0, 4.1888, 6.0737)',
      'stroke()',
    ]);
  });

  it('should turn the rings when the clock has moved on', () => {
    const calls = drawRecorded(createPortalRingsStep(PORTAL, 114, 42, 1, 0.25));

    expect(calls).toEqual([
      'set strokeStyle(#B98CFF)',
      'set lineWidth(3)',
      'beginPath()',
      'ellipse(114, 42, 10, 16, 0, 0.5, 2.385)',
      'stroke()',
      'beginPath()',
      'ellipse(114, 42, 10, 16, 0, 2.5944, 4.4794)',
      'stroke()',
      'beginPath()',
      'ellipse(114, 42, 10, 16, 0, 4.6888, 6.5737)',
      'stroke()',
    ]);
  });
});
