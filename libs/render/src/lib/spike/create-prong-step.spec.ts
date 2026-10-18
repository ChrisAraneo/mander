import type { Triangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createProngStep } from './create-prong-step';

const PRONG: Triangle = [
  { x: 0, y: 32 },
  { x: 8, y: 16 },
  { x: 16, y: 32 },
];

describe('createProngStep', () => {
  it('should draw the prong in the steel colours when no colours are given', () => {
    const calls = drawRecorded(createProngStep(PRONG));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(0, 32)',
      'lineTo(8, 16)',
      'lineTo(16, 32)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(0, 32, 0, 16)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });

  it('should draw the prong in the given colours when colours are given', () => {
    const calls = drawRecorded(
      createProngStep(PRONG, [
        [0, '#000000'],
        [1, '#FFFFFF'],
      ]),
    );

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(0, 32)',
      'lineTo(8, 16)',
      'lineTo(16, 32)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(0, 32, 0, 16)',
      'addColorStop(0, #000000)',
      'addColorStop(1, #FFFFFF)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });
});
