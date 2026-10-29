import type { Enemy, EnemyKind } from '@mander/model';
import { every, filter, map, replace, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { hashRecorded } from '../../test/hash-recorded';
import { drawEnemy } from './draw-enemy';

const createBaseEnemy = (kind: EnemyKind, isGrounded: boolean): Enemy => ({
  kind,
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 64, y: 96 },
  statuses: { isFacingRight: true, isGrounded },
});

const drawBaseEnemy = (kind: EnemyKind, isGrounded: boolean): string[] =>
  drawRecorded((context) =>
    drawEnemy(context, createBaseEnemy(kind, isGrounded), 0),
  );

const countCalls = (calls: string[], name: string): number =>
  size(filter(calls, (call) => startsWith(call, `${name}(`)));

const filterJawTilts = (calls: string[]): number[] =>
  map(
    filter(calls, (call) => startsWith(call, 'rotate(')),
    (call) => Number(replace(call, /^rotate\((.*)\)$/, '$1')),
  );

const createTestEnemy = (
  kind: EnemyKind,
  isFacingRight: boolean,
  isGrounded: boolean,
  death: number | null,
): Enemy => ({
  kind,
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death, reload: 0 },
  spawn: { x: 70, y: 96 },
  statuses: { isFacingRight, isGrounded },
});

describe('drawEnemy', () => {
  it('should draw the trap and hand the canvas back as it found it when the enemy is a beartrap', () => {
    const calls = drawBaseEnemy('BEARTRAP', true);

    expect(size(calls)).toBeGreaterThan(0);
    expect(countCalls(calls, 'save')).toBe(countCalls(calls, 'restore'));
  });

  it('should gape the jaws when the trap is resting and shut them when it leaps', () => {
    const resting = filterJawTilts(drawBaseEnemy('BEARTRAP', true));
    const leaping = filterJawTilts(drawBaseEnemy('BEARTRAP', false));

    expect(size(resting)).toBe(2);
    expect(size(leaping)).toBe(2);
    expect(every(resting, (tilt) => tilt < 0)).toBe(true);
    expect(every(leaping, (tilt) => tilt > 0)).toBe(true);
  });

  it('should draw the enemy as it always was when it is not a beartrap', () => {
    expect(size(filterJawTilts(drawBaseEnemy('HOPPING', true)))).toBe(0);
    expect(countCalls(drawBaseEnemy('HOPPING', true), 'save')).toBe(
      countCalls(drawBaseEnemy('HOPPING', true), 'restore'),
    );
  });

  it('should draw the hopping enemy wobbling with open eyes when it stands on the ground facing right', () => {
    const calls = drawRecorded((context) =>
      drawEnemy(context, createTestEnemy('HOPPING', true, true, null), 0),
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

  it('should draw the hopping enemy mirrored and still when it jumps facing left', () => {
    const calls = drawRecorded((context) =>
      drawEnemy(context, createTestEnemy('HOPPING', false, false, null), 0.5),
    );

    expect(calls).toEqual([
      'save()',
      'translate(75, 107)',
      'scale(-1, 1)',
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

  it('should draw three horns on the enemy when it is a horned enemy', () => {
    const calls = drawRecorded((context) =>
      drawEnemy(context, createTestEnemy('HORNED', true, true, null), 0.25),
    );

    expect(calls).toEqual([
      'save()',
      'translate(75, 106.3809)',
      'scale(1, 1)',
      'beginPath()',
      'rect(-8, 7, 5, 3)',
      'rect(3, 7, 5, 3)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#7D2F2A)',
      'fill()',
      'beginPath()',
      'roundRect(-9, -9, 18, 18, 6)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#B5473F)',
      'fill()',
      'set fillStyle(#D5695F)',
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
      'set fillStyle(#7D2F2A)',
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
      'set fillStyle(#7D2F2A)',
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
      'set fillStyle(#7D2F2A)',
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
      'set strokeStyle(#3A1512)',
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

  it('should draw flapping wings on the enemy when it is a flying enemy', () => {
    const calls = drawRecorded((context) =>
      drawEnemy(context, createTestEnemy('FLYING', true, false, null), 0.37),
    );

    expect(calls).toEqual([
      'save()',
      'translate(75, 107)',
      'scale(1, 1)',
      'save()',
      'translate(-8, -3)',
      'rotate(0.3179)',
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
      'rotate(-0.3179)',
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
      'set fillStyle(#1E5FA8)',
      'fill()',
      'beginPath()',
      'roundRect(-9, -9, 18, 18, 6)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#3C8DE0)',
      'fill()',
      'set fillStyle(#7FC3FF)',
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
      'set strokeStyle(#123A6B)',
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

  it('should draw the trap with its jaws open when it rests on the ground', () => {
    const fingerprint = hashRecorded((context) =>
      drawEnemy(context, createTestEnemy('BEARTRAP', true, true, null), 0.1),
    );

    expect(fingerprint).toBe('105:04DSCIU00T2CTV');
  });

  it('should draw the trap with its jaws shut when it leaps', () => {
    const fingerprint = hashRecorded((context) =>
      drawEnemy(context, createTestEnemy('BEARTRAP', false, false, null), 0.1),
    );

    expect(fingerprint).toBe('105:04JYLDF0SJFSYO');
  });

  it('should draw the enemy squashed with crossed-out eyes when it is dying', () => {
    const calls = drawRecorded((context) =>
      drawEnemy(context, createTestEnemy('HOPPING', true, true, 0.15), 0.2),
    );

    expect(calls).toEqual([
      'save()',
      'translate(75, 111.675)',
      'scale(1.175, 0.575)',
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
      'set lineWidth(1.2)',
      'beginPath()',
      'moveTo(-6, -6)',
      'lineTo(-1.5, -2)',
      'moveTo(-1.5, -6)',
      'lineTo(-6, -2)',
      'moveTo(1, -6)',
      'lineTo(5.5, -2)',
      'moveTo(5.5, -6)',
      'lineTo(1, -2)',
      'stroke()',
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

  it('should draw the trap with its jaws shut when it is dying on the ground', () => {
    const fingerprint = hashRecorded((context) =>
      drawEnemy(context, createTestEnemy('BEARTRAP', true, true, 0.1), 0.2),
    );

    expect(fingerprint).toBe('105:00CBOED0757KOH');
  });
});
