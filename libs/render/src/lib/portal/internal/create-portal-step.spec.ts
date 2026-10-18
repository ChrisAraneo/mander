import type { Rectangle } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../../test/create-render-test-state';
import { drawRecorded } from '../../../test/draw-recorded';
import { createPortalStep } from './create-portal-step';

const PORTAL: Rectangle = { x: 100, y: 20, width: 28, height: 44 };

const ROWS = ['...P.', '.@.P.', '#####'];

describe('createPortalStep', () => {
  it('should draw the core and its rings at rest when the clock is at zero', () => {
    const calls = drawRecorded(
      createPortalStep(PORTAL, createRenderTestState(ROWS)),
    );

    expect(calls).toEqual([
      'save()',
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
      'restore()',
    ]);
  });

  it('should draw the portal pulsing when the clock has moved on', () => {
    const calls = drawRecorded(
      createPortalStep(PORTAL, createRenderTestState(ROWS, { time: 0.25 })),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'ellipse(114, 42, 14.4771, 22.7498, 0, 0, 6.2832)',
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
      'set strokeStyle(#B98CFF)',
      'set lineWidth(3)',
      'beginPath()',
      'ellipse(114, 42, 10.3408, 16.5453, 0, 0.5, 2.385)',
      'stroke()',
      'beginPath()',
      'ellipse(114, 42, 10.3408, 16.5453, 0, 2.5944, 4.4794)',
      'stroke()',
      'beginPath()',
      'ellipse(114, 42, 10.3408, 16.5453, 0, 4.6888, 6.5737)',
      'stroke()',
      'restore()',
    ]);
  });
});
