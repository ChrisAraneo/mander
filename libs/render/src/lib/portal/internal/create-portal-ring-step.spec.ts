import type { Rectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createPortalRingStep } from './create-portal-ring-step';

const PORTAL: Rectangle = { x: 100, y: 20, width: 28, height: 44 };

describe('createPortalRingStep', () => {
  it('should trace one arc of a ring from the given angle when it is given an angle', () => {
    const calls = drawRecorded(createPortalRingStep(PORTAL, 114, 42, 1, 0.5));

    expect(calls).toEqual([
      'beginPath()',
      'ellipse(114, 42, 10, 16, 0, 0.5, 2.385)',
      'stroke()',
    ]);
  });
});
