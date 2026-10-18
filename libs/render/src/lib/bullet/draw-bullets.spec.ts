import type { Bullet } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawBullets } from './draw-bullets';

const ROWS = ['.@..', '####'];

const BULLETS: Bullet[] = [
  { position: { x: 100, y: 50 }, velocity: { x: { current: 300, max: 300 } } },
  { position: { x: 40, y: 70 }, velocity: { x: { current: -300, max: 300 } } },
];

describe('drawBullets', () => {
  it('should draw every bullet in order when two bullets are in flight', () => {
    const state = createRenderTestState(ROWS, { bullets: BULLETS });

    const calls = drawRecorded((context) => drawBullets(context, state));

    expect(calls).toEqual([
      'save()',
      'translate(105, 55)',
      'scale(1, 1)',
      'set fillStyle(RGBA(123, 232, 255, 0.45))',
      'beginPath()',
      'ellipse(-9, 0, 18, 2.8, 0, 0, 6.2832)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(0, 0, 5, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(-1.6667, -1.6667, 1, 0, 0, 5)',
      'addColorStop(0, #BFEDFF)',
      'addColorStop(1, #12303F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.75))',
      'beginPath()',
      'arc(-1.6667, -1.6667, 1.25, 0, 6.2832)',
      'fill()',
      'restore()',
      'save()',
      'translate(45, 75)',
      'scale(-1, 1)',
      'set fillStyle(RGBA(123, 232, 255, 0.45))',
      'beginPath()',
      'ellipse(-9, 0, 18, 2.8, 0, 0, 6.2832)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(0, 0, 5, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(-1.6667, -1.6667, 1, 0, 0, 5)',
      'addColorStop(0, #BFEDFF)',
      'addColorStop(1, #12303F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.75))',
      'beginPath()',
      'arc(-1.6667, -1.6667, 1.25, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw nothing when no bullet is in flight', () => {
    const state = createRenderTestState(ROWS);

    const calls = drawRecorded((context) => drawBullets(context, state));

    expect(calls).toEqual([]);
  });
});
