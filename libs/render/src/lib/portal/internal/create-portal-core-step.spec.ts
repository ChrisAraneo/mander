import type { Rectangle } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createPortalCoreStep } from './create-portal-core-step';

const PORTAL: Rectangle = { x: 100, y: 20, width: 28, height: 44 };

describe('createPortalCoreStep', () => {
  it('should draw the swirling core at its usual size when the pulse is at rest', () => {
    const calls = drawRecorded(createPortalCoreStep(PORTAL, 114, 42, 1));

    expect(calls).toEqual([
      'beginPath()',
      'ellipse(114, 42, 14, 22, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(114, 42, 2, 114, 42, 22)',
      'addColorStop(0, #E9DCFF)',
      'addColorStop(0.45, #8D55E0)',
      'addColorStop(1, #3C2470)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });

  it('should draw the core larger when the pulse swells', () => {
    const calls = drawRecorded(createPortalCoreStep(PORTAL, 114, 42, 1.05));

    expect(calls).toEqual([
      'beginPath()',
      'ellipse(114, 42, 14.7, 23.1, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(114, 42, 2, 114, 42, 22)',
      'addColorStop(0, #E9DCFF)',
      'addColorStop(0.45, #8D55E0)',
      'addColorStop(1, #3C2470)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });
});
