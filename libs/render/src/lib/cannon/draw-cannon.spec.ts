import type { Cannon } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { drawCannon } from './draw-cannon';

const CANNON: Cannon = {
  position: { x: 128, y: 64 },
  timers: { reload: 0.5 },
  statuses: { isFacingRight: true },
};

describe('drawCannon', () => {
  it('should draw the cannon on the canvas when it is given one cannon', () => {
    const calls = drawRecorded((context) => drawCannon(context, CANNON));

    expect(calls).toEqual([
      'save()',
      'translate(144, 80)',
      'beginPath()',
      'roundRect(-15, -15, 30, 30, 5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(0, -16, 0, 16)',
      'addColorStop(0, #454E62)',
      'addColorStop(1, #1D2330)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#6B7690)',
      'fillRect(-12, -13, 24, 3)',
      'set fillStyle(#1D2330)',
      'beginPath()',
      'arc(-11, -11, 1.5, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(11, -11, 1.5, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(-11, 11, 1.5, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(11, 11, 1.5, 0, 6.2832)',
      'fill()',
      'scale(1, 1)',
      'beginPath()',
      'roundRect(-5, -6.5, 28, 13, 3)',
      'roundRect(18, -9, 5, 18, 2)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(0, -6.5, 0, 6.5)',
      'addColorStop(0, #8892A8)',
      'addColorStop(0.45, #454E62)',
      'addColorStop(1, #1D2330)',
      'set fillStyle(gradient)',
      'fill()',
      'beginPath()',
      'arc(-4, 0, 5, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#6B7690)',
      'fill()',
      'set fillStyle(#1D2330)',
      'beginPath()',
      'arc(-4, 0, 2, 0, 6.2832)',
      'fill()',
      'save()',
      'set fillStyle(#FF9E3D)',
      'beginPath()',
      'arc(22, 0, 1.7143, 0, 6.2832)',
      'fill()',
      'restore()',
      'restore()',
    ]);
  });
});
