import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createPlayerStep } from './create-player-step';

const createTestPlayer = (
  speed: number,
  isGrounded: boolean,
  death: number | null,
): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: speed, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded, isJumpQueued: false },
});

describe('createPlayerStep', () => {
  it('should place the walking player at its position when it walks on the ground', () => {
    const calls = drawRecorded(
      createPlayerStep(createTestPlayer(120, true, null), 0.1),
    );

    expect(calls).toEqual([
      'save()',
      'translate(75, 120)',
      'rotate(0)',
      'scale(1, 1)',
      'beginPath()',
      'rect(-4.5364, 6, 5, 18)',
      'rect(-0.4636, 6, 5, 18)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#3F5A86)',
      'fill()',
      'beginPath()',
      'roundRect(-8, -9, 16, 19, 5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F4762C)',
      'fill()',
      'set fillStyle(#E0651F)',
      'beginPath()',
      'roundRect(-4.4636, -6, 4, 12, 2)',
      'fill()',
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F2C49B)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'clip()',
      'set fillStyle(#4A3021)',
      'beginPath()',
      'arc(0.5, -17.5, 6.8, 2.9845, 6.346)',
      'fill()',
      'restore()',
      'set fillStyle(#1C1C28)',
      'beginPath()',
      'arc(4.2, -15.6, 1.5, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should spin the player when it is dying', () => {
    const calls = drawRecorded(
      createPlayerStep(createTestPlayer(0, true, 0.4), 0.3),
    );

    expect(calls).toEqual([
      'save()',
      'translate(75, 120)',
      'rotate(-1.508)',
      'scale(1, 1)',
      'beginPath()',
      'rect(-7, 6, 5, 18)',
      'rect(2, 6, 5, 18)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#3F5A86)',
      'fill()',
      'beginPath()',
      'roundRect(-8, -9, 16, 19, 5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F4762C)',
      'fill()',
      'set fillStyle(#E0651F)',
      'beginPath()',
      'roundRect(-2, -6, 4, 12, 2)',
      'fill()',
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F2C49B)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'clip()',
      'set fillStyle(#4A3021)',
      'beginPath()',
      'arc(0.5, -17.5, 6.8, 2.9845, 6.346)',
      'fill()',
      'restore()',
      'set fillStyle(#1C1C28)',
      'set strokeStyle(#1C1C28)',
      'set lineWidth(1.4)',
      'beginPath()',
      'moveTo(2.4, -17.4)',
      'lineTo(6, -13.8)',
      'moveTo(6, -17.4)',
      'lineTo(2.4, -13.8)',
      'stroke()',
      'restore()',
    ]);
  });
});
