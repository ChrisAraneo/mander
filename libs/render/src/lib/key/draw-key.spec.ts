import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawKey } from './draw-key';

const KEY_ROWS = ['.@.K.', '#####'];

describe('drawKey', () => {
  it('should draw the key bobbing over its tile when it is still waiting to be picked up', () => {
    const state = createRenderTestState(KEY_ROWS, { time: 0.5 });

    const calls = drawRecorded((context) => drawKey(context, state));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(112, 6.9925, 4.5, 0, 6.2832)',
      'moveTo(112, 11.4925)',
      'lineTo(112, 20.9925)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(7)',
      'set lineJoin(round)',
      'stroke()',
      'beginPath()',
      'rect(112, 14.9925, 5, 2.5)',
      'rect(112, 18.9925, 6, 2.5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set strokeStyle(#FFD166)',
      'set lineWidth(3)',
      'beginPath()',
      'arc(112, 6.9925, 4.5, 0, 6.2832)',
      'moveTo(112, 11.4925)',
      'lineTo(112, 20.9925)',
      'stroke()',
      'set fillStyle(#FFD166)',
      'beginPath()',
      'rect(112, 14.9925, 5, 2.5)',
      'rect(112, 18.9925, 6, 2.5)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw nothing when the player already holds the key', () => {
    const state = createRenderTestState(KEY_ROWS, { hasKey: true });

    const calls = drawRecorded((context) => drawKey(context, state));

    expect(calls).toEqual([]);
  });

  it('should draw nothing when the level has no key', () => {
    const state = createRenderTestState(['.@...', '#####']);

    const calls = drawRecorded((context) => drawKey(context, state));

    expect(calls).toEqual([]);
  });
});
