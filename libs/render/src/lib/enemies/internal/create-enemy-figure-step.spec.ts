import type { Enemy, EnemyKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { hashRecorded } from '../../../test/hash-recorded';
import { createEnemyFigureStep } from './create-enemy-figure-step';
import type { EnemyPalette } from './types/enemy-palette';

const PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

const createTestEnemy = (kind: EnemyKind, isGrounded: boolean): Enemy => ({
  kind,
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 64, y: 96 },
  statuses: { isFacingRight: true, isGrounded },
});

describe('createEnemyFigureStep', () => {
  it('should draw a set trap when a beartrap rests on the ground', () => {
    const fingerprint = hashRecorded(
      createEnemyFigureStep(
        createTestEnemy('BEARTRAP', true),
        PALETTE,
        false,
        0.2,
      ),
    );

    expect(fingerprint).toBe('101:08IHHCB0BO8E62');
  });

  it('should draw a snapped trap when a beartrap is in the air', () => {
    const fingerprint = hashRecorded(
      createEnemyFigureStep(
        createTestEnemy('BEARTRAP', false),
        PALETTE,
        false,
        0.2,
      ),
    );

    expect(fingerprint).toBe('101:1W6SG4J1P6VFLD');
  });

  it('should draw a snapped trap when a beartrap is dying on the ground', () => {
    const fingerprint = hashRecorded(
      createEnemyFigureStep(
        createTestEnemy('BEARTRAP', true),
        PALETTE,
        true,
        0.2,
      ),
    );

    expect(fingerprint).toBe('101:1W6SG4J1P6VFLD');
  });

  it('should draw the creature when the enemy hops', () => {
    const calls = drawRecorded(
      createEnemyFigureStep(
        createTestEnemy('HOPPING', true),
        PALETTE,
        false,
        0.2,
      ),
    );

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
    ]);
  });

  it('should draw the creature with horns when the enemy has horns', () => {
    const calls = drawRecorded(
      createEnemyFigureStep(
        createTestEnemy('HORNED', true),
        PALETTE,
        false,
        0.2,
      ),
    );

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
    ]);
  });

  it('should draw the same creature as a hopping enemy when the enemy is fast', () => {
    const calls = drawRecorded(
      createEnemyFigureStep(createTestEnemy('FAST', true), PALETTE, false, 0.2),
    );

    expect(calls).toEqual(
      drawRecorded(
        createEnemyFigureStep(
          createTestEnemy('HOPPING', true),
          PALETTE,
          false,
          0.2,
        ),
      ),
    );
  });

  it('should draw the same creature as a horned enemy when the enemy shoots', () => {
    const calls = drawRecorded(
      createEnemyFigureStep(
        createTestEnemy('SHOOTER', true),
        PALETTE,
        false,
        0.2,
      ),
    );

    expect(calls).toEqual(
      drawRecorded(
        createEnemyFigureStep(
          createTestEnemy('HORNED', true),
          PALETTE,
          false,
          0.2,
        ),
      ),
    );
  });

  it('should draw the creature with wings when the enemy flies', () => {
    const calls = drawRecorded(
      createEnemyFigureStep(
        createTestEnemy('FLYING', false),
        PALETTE,
        false,
        0.2,
      ),
    );

    expect(calls).toEqual([
      'save()',
      'translate(-8, -3)',
      'rotate(-0.5456)',
      'beginPath()',
      'ellipse(-7, 0, 8, 3.5, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
      'save()',
      'translate(8, -3)',
      'rotate(0.5456)',
      'beginPath()',
      'ellipse(7, 0, 8, 3.5, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
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
    ]);
  });
});
