import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { GOLD_STAR } from './consts';
import { createStarStep } from './create-star-step';

describe('createStarStep', () => {
  it('should draw the five-armed gold star when it is given a centre and a radius', () => {
    const calls = drawRecorded(createStarStep(16, 16, 10, GOLD_STAR));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(16, 6)',
      'lineTo(18.5863, 12.4403)',
      'lineTo(25.5106, 12.9098)',
      'lineTo(20.1846, 17.3597)',
      'lineTo(21.8779, 24.0902)',
      'lineTo(16, 20.4)',
      'lineTo(10.1221, 24.0902)',
      'lineTo(11.8154, 17.3597)',
      'lineTo(6.4894, 12.9098)',
      'lineTo(13.4137, 12.4403)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(16, 6, 16, 26)',
      'addColorStop(0, #FFF8DC)',
      'addColorStop(0.45, #FFC93C)',
      'addColorStop(1, #A66A00)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the star larger and elsewhere when it is given another centre and radius', () => {
    const calls = drawRecorded(createStarStep(40, 8, 20, GOLD_STAR));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(40, -12)',
      'lineTo(45.1725, 0.8807)',
      'lineTo(59.0211, 1.8197)',
      'lineTo(48.3693, 10.7193)',
      'lineTo(51.7557, 24.1803)',
      'lineTo(40, 16.8)',
      'lineTo(28.2443, 24.1803)',
      'lineTo(31.6307, 10.7193)',
      'lineTo(20.9789, 1.8197)',
      'lineTo(34.8275, 0.8807)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(40, -12, 40, 28)',
      'addColorStop(0, #FFF8DC)',
      'addColorStop(0.45, #FFC93C)',
      'addColorStop(1, #A66A00)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });
});
