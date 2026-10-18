import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createEnemyHornsStep } from './create-enemy-horns-step';
import type { EnemyPalette } from './types/enemy-palette';

const PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

describe('createEnemyHornsStep', () => {
  it('should draw three horns from left to right when it is given a palette', () => {
    const calls = drawRecorded(createEnemyHornsStep(PALETTE));

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
      'beginPath()',
      'moveTo(-2, -9)',
      'lineTo(2, -9)',
      'lineTo(0, -15)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#2A7D2A)',
      'fill()',
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
