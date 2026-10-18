import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { drawFireball } from './draw-fireball';

const FIREBALL: Fireball = {
  spin: 'CLOCKWISE',
  origin: { x: 128, y: 96 },
  angle: 0.7,
};

describe('drawFireball', () => {
  it('should draw the fireball on the canvas when it is given one fireball', () => {
    const calls = drawRecorded((context) =>
      drawFireball(context, FIREBALL, 0.5),
    );

    expect(calls).toEqual([
      'save()',
      'translate(250.3747, 199.0748)',
      'rotate(2.2708)',
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 8.9486, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 8.9486)',
      'addColorStop(0, #FFF3C4)',
      'addColorStop(0.45, #FFB03A)',
      'addColorStop(1, #D8341C)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFF3C4)',
      'beginPath()',
      'arc(0, 0, 3.4418, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });
});
