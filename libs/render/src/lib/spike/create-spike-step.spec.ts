import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../test/create-render-test-level';
import { drawRecorded } from '../../test/draw-recorded';
import { createSpikeStep } from './create-spike-step';

describe('createSpikeStep', () => {
  it('should draw the spike pointing up when it stands alone on the floor', () => {
    const level = createRenderTestLevel(['....', '.^..', '####']);

    const calls = drawRecorded(createSpikeStep(level, 1, 1));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(45.1667, 64)',
      'lineTo(48, 42.24)',
      'lineTo(50.8333, 64)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(45.1667, 64, 45.1667, 42.24)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });

  it('should draw the spike pointing down when it hangs from the ceiling', () => {
    const level = createRenderTestLevel(['####', '.v..', '....']);

    const calls = drawRecorded(createSpikeStep(level, 1, 1));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(45.1667, 32)',
      'lineTo(48, 53.76)',
      'lineTo(50.8333, 32)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(45.1667, 32, 45.1667, 53.76)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });

  it('should draw the spike as part of a strip when spikes stand side by side', () => {
    const level = createRenderTestLevel(['....', '^^^.', '####']);

    const calls = drawRecorded(createSpikeStep(level, 1, 1));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(34.5, 64)',
      'lineTo(37.3333, 42.24)',
      'lineTo(40.1667, 64)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(34.5, 64, 34.5, 42.24)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
      'beginPath()',
      'moveTo(45.1667, 64)',
      'lineTo(48, 42.24)',
      'lineTo(50.8333, 64)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(45.1667, 64, 45.1667, 42.24)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
      'beginPath()',
      'moveTo(55.8333, 64)',
      'lineTo(58.6667, 42.24)',
      'lineTo(61.5, 64)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(55.8333, 64, 55.8333, 42.24)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });
});
