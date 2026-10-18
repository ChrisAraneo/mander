import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawFireballs } from './draw-fireballs';

const ROWS = ['.@..', '####'];

const FIREBALLS: Fireball[] = [
  { spin: 'CLOCKWISE', origin: { x: 128, y: 96 }, angle: 0.7 },
  { spin: 'ANTICLOCKWISE', origin: { x: 64, y: 32 }, angle: 2 },
];

describe('drawFireballs', () => {
  it('should draw every fireball of the level in order when it holds two', () => {
    const state = createRenderTestState(ROWS, {
      fireballs: FIREBALLS,
      time: 0.5,
    });

    const calls = drawRecorded((context) => drawFireballs(context, state));

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
      'save()',
      'translate(-2.5835, 177.4876)',
      'rotate(0.4292)',
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 8.3956, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 8.3956)',
      'addColorStop(0, #FFF3C4)',
      'addColorStop(0.45, #FFB03A)',
      'addColorStop(1, #D8341C)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFF3C4)',
      'beginPath()',
      'arc(0, 0, 3.2291, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw nothing when the level holds no fireball', () => {
    const state = createRenderTestState(ROWS);

    const calls = drawRecorded((context) => drawFireballs(context, state));

    expect(calls).toEqual([]);
  });
});
