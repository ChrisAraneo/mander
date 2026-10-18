import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createEnemyBodyStep } from './create-enemy-body-step';
import type { EnemyPalette } from './types/enemy-palette';

const PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

describe('createEnemyBodyStep', () => {
  it('should draw the feet, the round body and the belly in the palette colours when it is given a palette', () => {
    const calls = drawRecorded(createEnemyBodyStep(PALETTE));

    expect(calls).toEqual([
      'beginPath()',
      'rect(-8, 7, 5, 3)',
      'rect(3, 7, 5, 3)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#2A7D2A)',
      'fill()',
      'beginPath()',
      'roundRect(-9, -9, 18, 18, 6)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#3FB53F)',
      'fill()',
      'set fillStyle(#5FD55F)',
      'beginPath()',
      'roundRect(-6, -1, 12, 8, 4)',
      'fill()',
    ]);
  });
});
