import type { Snowball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createSnowballStep } from './create-snowball-step';

const SNOWBALL_RIGHT: Snowball = {
  position: { x: 200, y: 40 },
  velocity: { x: { current: 220, max: 220 } },
};

const SNOWBALL_LEFT: Snowball = {
  position: { x: 80, y: 60 },
  velocity: { x: { current: -220, max: 220 } },
};

describe('createSnowballStep', () => {
  it('should draw the snowball with its trail behind it when it flies to the right', () => {
    const calls = drawRecorded(createSnowballStep(SNOWBALL_RIGHT));

    expect(calls).toEqual([
      'save()',
      'translate(206, 46)',
      'scale(1, 1)',
      'set fillStyle(RGBA(214, 240, 255, 0.45))',
      'beginPath()',
      'ellipse(-7.5, 0, 15, 3.2, 0, 0, 6.2832)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(0, 0, 6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(-2, -2, 1, 0, 0, 6)',
      'addColorStop(0, #FFFFFF)',
      'addColorStop(1, #9FC4DA)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.85))',
      'beginPath()',
      'arc(-2, -2, 1.5, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the snowball mirrored when it flies to the left', () => {
    const calls = drawRecorded(createSnowballStep(SNOWBALL_LEFT));

    expect(calls).toEqual([
      'save()',
      'translate(86, 66)',
      'scale(-1, 1)',
      'set fillStyle(RGBA(214, 240, 255, 0.45))',
      'beginPath()',
      'ellipse(-7.5, 0, 15, 3.2, 0, 0, 6.2832)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(0, 0, 6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(-2, -2, 1, 0, 0, 6)',
      'addColorStop(0, #FFFFFF)',
      'addColorStop(1, #9FC4DA)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.85))',
      'beginPath()',
      'arc(-2, -2, 1.5, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });
});
