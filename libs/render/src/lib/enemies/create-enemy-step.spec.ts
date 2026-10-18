import type { Enemy, EnemyKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { hashRecorded } from '../../test/hash-recorded';
import { createEnemyStep } from './create-enemy-step';

const createTestEnemy = (
  kind: EnemyKind,
  isGrounded: boolean,
  death: number | null,
): Enemy => ({
  kind,
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death },
  spawn: { x: 70, y: 96 },
  statuses: { isFacingRight: true, isGrounded },
});

describe('createEnemyStep', () => {
  it('should place the wobbling enemy at its position when it hops on the ground', () => {
    const calls = drawRecorded(
      createEnemyStep(createTestEnemy('HOPPING', true, null), 0),
    );

    expect(calls).toEqual([
      'save()',
      'translate(75, 108.1887)',
      'scale(1, 1)',
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
      'set fillStyle(#FDF3EA)',
      'beginPath()',
      'arc(-4, -4, 3.2, 0, 6.2832)',
      'arc(3, -4, 3.2, 0, 6.2832)',
      'fill()',
      'set strokeStyle(#1C1C28)',
      'set fillStyle(#1C1C28)',
      'beginPath()',
      'arc(-3, -4, 1.4, 0, 6.2832)',
      'arc(4, -4, 1.4, 0, 6.2832)',
      'fill()',
      'set strokeStyle(#123A12)',
      'set lineWidth(1.4)',
      'beginPath()',
      'moveTo(-7, -8)',
      'lineTo(-1, -6)',
      'moveTo(7, -8)',
      'lineTo(1, -6)',
      'stroke()',
      'restore()',
    ]);
  });

  it('should squash and swell the enemy when it is dying', () => {
    const fingerprint = hashRecorded(
      createEnemyStep(createTestEnemy('HORNED', true, 0.15), 0.2),
    );

    expect(fingerprint).toBe('84:1SHGCSQ1X4T15B');
  });
});
