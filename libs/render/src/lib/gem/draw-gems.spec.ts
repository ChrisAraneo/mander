import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawGems } from './draw-gems';

describe('drawGems', () => {
  it('should draw every gem spinning and bobbing when the level holds two gems', () => {
    const state = createRenderTestState(['.G.G.', '.@...', '#####'], {
      time: 0.4,
    });

    const calls = drawRecorded((context) => drawGems(context, state));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(48, 10.4255)',
      'lineTo(52.2906, 16.4255)',
      'lineTo(48, 26.4255)',
      'lineTo(43.7094, 16.4255)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(48, 10.4255, 48, 26.4255)',
      'addColorStop(0, #DFFBFF)',
      'addColorStop(0.45, #35C7E0)',
      'addColorStop(1, #12718F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set strokeStyle(#12718F)',
      'set lineWidth(1)',
      'beginPath()',
      'moveTo(43.7094, 16.4255)',
      'lineTo(52.2906, 16.4255)',
      'stroke()',
      'save()',
      'beginPath()',
      'moveTo(112, 5.3853)',
      'lineTo(118.9966, 11.3853)',
      'lineTo(112, 21.3853)',
      'lineTo(105.0034, 11.3853)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(112, 5.3853, 112, 21.3853)',
      'addColorStop(0, #DFFBFF)',
      'addColorStop(0.45, #35C7E0)',
      'addColorStop(1, #12718F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set strokeStyle(#12718F)',
      'set lineWidth(1)',
      'beginPath()',
      'moveTo(105.0034, 11.3853)',
      'lineTo(118.9966, 11.3853)',
      'stroke()',
    ]);
  });

  it('should draw nothing when the level holds no gem', () => {
    const state = createRenderTestState(['.@...', '#####']);

    const calls = drawRecorded((context) => drawGems(context, state));

    expect(calls).toEqual([]);
  });
});
