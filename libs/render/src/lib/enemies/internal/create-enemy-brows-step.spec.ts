import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createEnemyBrowsStep } from './create-enemy-brows-step';
import type { EnemyPalette } from './types/enemy-palette';

const PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

describe('createEnemyBrowsStep', () => {
  it('should draw two angry brows in the palette colour when it is given a palette', () => {
    const calls = drawRecorded(createEnemyBrowsStep(PALETTE));

    expect(calls).toEqual([
      'set strokeStyle(#123A12)',
      'set lineWidth(1.4)',
      'beginPath()',
      'moveTo(-7, -8)',
      'lineTo(-1, -6)',
      'moveTo(7, -8)',
      'lineTo(1, -6)',
      'stroke()',
    ]);
  });
});
