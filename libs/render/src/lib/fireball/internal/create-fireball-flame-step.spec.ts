import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { EMBER_FIREBALL } from '../consts';
import { createFireballFlameStep } from './create-fireball-flame-step';

const FIREBALL: Fireball = {
  spin: 'CLOCKWISE',
  origin: { x: 200, y: 200 },
  angle: 0,
};

describe('createFireballFlameStep', () => {
  it('should draw the flame at the given position heading along the orbit when given a fireball', () => {
    const calls = drawRecorded(
      createFireballFlameStep(FIREBALL, { x: 10, y: 20 }, 0, EMBER_FIREBALL),
    );

    expect(calls).toEqual([
      'save()',
      'translate(10, 20)',
      'rotate(1.5708)',
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 8, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 8)',
      'addColorStop(0, #FFF3C4)',
      'addColorStop(0.45, #FFB03A)',
      'addColorStop(1, #D8341C)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFF3C4)',
      'beginPath()',
      'arc(0, 0, 3.0769, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should grow the flame with the flicker when time has moved on', () => {
    const calls = drawRecorded(
      createFireballFlameStep(FIREBALL, { x: 10, y: 20 }, 0.1, EMBER_FIREBALL),
    );

    expect(calls).toContain('arc(0, 0, 8.946, 0, 6.2832)');
  });
});
