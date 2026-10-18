import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createEnemyHornStep } from './create-enemy-horn-step';
import type { EnemyPalette } from './types/enemy-palette';

const PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

describe('createEnemyHornStep', () => {
  it('should draw a horn left of the middle when it is given a negative position', () => {
    const calls = drawRecorded(createEnemyHornStep(-5, PALETTE));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(-7, -9)',
      'lineTo(-3, -9)',
      'lineTo(-5, -15)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#2A7D2A)',
      'fill()',
    ]);
  });

  it('should draw a horn right of the middle when it is given a positive position', () => {
    const calls = drawRecorded(createEnemyHornStep(5, PALETTE));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(3, -9)',
      'lineTo(7, -9)',
      'lineTo(5, -15)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#2A7D2A)',
      'fill()',
    ]);
  });
});
