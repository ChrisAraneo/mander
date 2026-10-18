import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createGemStep } from './create-gem-step';

describe('createGemStep', () => {
  it('should draw the gem over its tile when the clock is at zero', () => {
    const calls = drawRecorded(createGemStep({ x: 2, y: 0 }, 0));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(80, 10.7279)',
      'lineTo(85.1975, 16.7279)',
      'lineTo(80, 26.7279)',
      'lineTo(74.8025, 16.7279)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(80, 10.7279, 80, 26.7279)',
      'addColorStop(0, #DFFBFF)',
      'addColorStop(0.45, #35C7E0)',
      'addColorStop(1, #12718F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set strokeStyle(#12718F)',
      'set lineWidth(1)',
      'beginPath()',
      'moveTo(74.8025, 16.7279)',
      'lineTo(85.1975, 16.7279)',
      'stroke()',
    ]);
  });

  it('should draw the gem lifted and turned when the clock has moved on', () => {
    const calls = drawRecorded(createGemStep({ x: 2, y: 0 }, 0.4));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(80, 7.8249)',
      'lineTo(87.7227, 13.8249)',
      'lineTo(80, 23.8249)',
      'lineTo(72.2773, 13.8249)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(80, 7.8249, 80, 23.8249)',
      'addColorStop(0, #DFFBFF)',
      'addColorStop(0.45, #35C7E0)',
      'addColorStop(1, #12718F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set strokeStyle(#12718F)',
      'set lineWidth(1)',
      'beginPath()',
      'moveTo(72.2773, 13.8249)',
      'lineTo(87.7227, 13.8249)',
      'stroke()',
    ]);
  });
});
