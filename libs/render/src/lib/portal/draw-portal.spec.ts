import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawPortal } from './draw-portal';

describe('drawPortal', () => {
  it('should draw the swirling portal with its rings when the level has a portal', () => {
    const state = createRenderTestState(['...P.', '.@.P.', '#####'], {
      time: 0.25,
    });

    const calls = drawRecorded((context) => drawPortal(context, state));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'ellipse(116, 32, 20.6816, 33.0906, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(116, 32, 2, 116, 32, 28)',
      'addColorStop(0, #E9DCFF)',
      'addColorStop(0.45, #8D55E0)',
      'addColorStop(1, #3C2470)',
      'set fillStyle(gradient)',
      'fill()',
      'set strokeStyle(#B98CFF)',
      'set lineWidth(3)',
      'beginPath()',
      'ellipse(116, 32, 16.5453, 26.8861, 0, 0.5, 2.385)',
      'stroke()',
      'beginPath()',
      'ellipse(116, 32, 16.5453, 26.8861, 0, 2.5944, 4.4794)',
      'stroke()',
      'beginPath()',
      'ellipse(116, 32, 16.5453, 26.8861, 0, 4.6888, 6.5737)',
      'stroke()',
      'restore()',
    ]);
  });

  it('should draw nothing when the level has no portal', () => {
    const state = createRenderTestState(['.@...', '#####']);

    const calls = drawRecorded((context) => drawPortal(context, state));

    expect(calls).toEqual([]);
  });
});
