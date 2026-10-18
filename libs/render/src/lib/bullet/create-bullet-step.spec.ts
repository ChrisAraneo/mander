import type { Bullet } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createBulletStep } from './create-bullet-step';

const BULLET_RIGHT: Bullet = {
  position: { x: 100, y: 50 },
  velocity: { x: { current: 300, max: 300 } },
};

const BULLET_LEFT: Bullet = {
  position: { x: 40, y: 70 },
  velocity: { x: { current: -300, max: 300 } },
};

describe('createBulletStep', () => {
  it('should draw the bullet with its trail behind it when it flies to the right', () => {
    const calls = drawRecorded(createBulletStep(BULLET_RIGHT));

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
    ]);
  });

  it('should draw the bullet mirrored when it flies to the left', () => {
    const calls = drawRecorded(createBulletStep(BULLET_LEFT));

    expect(calls).toEqual([
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
});
