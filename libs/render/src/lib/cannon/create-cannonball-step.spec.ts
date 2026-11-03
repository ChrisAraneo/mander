import type { Cannonball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createCannonballStep } from './create-cannonball-step';

const CANNONBALL_RIGHT: Cannonball = {
  position: { x: 200, y: 40 },
  velocity: { x: { current: 220, max: 220 }, y: { current: 0, max: 220 } },
};

const CANNONBALL_LEFT: Cannonball = {
  position: { x: 80, y: 60 },
  velocity: { x: { current: -220, max: 220 }, y: { current: 0, max: 220 } },
};

const CANNONBALL_CLIMBING_RIGHT: Cannonball = {
  position: { x: 200, y: 40 },
  velocity: { x: { current: 100, max: 220 }, y: { current: -100, max: 220 } },
};

const CANNONBALL_CLIMBING_LEFT: Cannonball = {
  position: { x: 200, y: 40 },
  velocity: { x: { current: -100, max: 220 }, y: { current: -100, max: 220 } },
};

describe('createCannonballStep', () => {
  it('should tilt the trail back along the flight when the ball climbs to the right', () => {
    const calls = drawRecorded(createCannonballStep(CANNONBALL_CLIMBING_RIGHT));

    expect(calls).toContain('scale(1, 1)');
    expect(calls).toContain(
      'ellipse(-5.3033, 5.3033, 15, 3.2, -0.7854, 0, 6.2832)',
    );
  });

  it('should tilt the mirrored trail back along the flight when the ball climbs to the left', () => {
    const calls = drawRecorded(createCannonballStep(CANNONBALL_CLIMBING_LEFT));

    expect(calls).toContain('scale(-1, 1)');
    expect(calls).toContain(
      'ellipse(-5.3033, 5.3033, 15, 3.2, -0.7854, 0, 6.2832)',
    );
  });

  it('should draw the ball with its trail behind it when it flies to the right', () => {
    const calls = drawRecorded(createCannonballStep(CANNONBALL_RIGHT));

    expect(calls).toEqual([
      'save()',
      'translate(206, 46)',
      'scale(1, 1)',
      'set fillStyle(RGBA(255, 158, 61, 0.45))',
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
      'addColorStop(0, #7C8496)',
      'addColorStop(1, #171C26)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.55))',
      'beginPath()',
      'arc(-2, -2, 1.5, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the ball mirrored when it flies to the left', () => {
    const calls = drawRecorded(createCannonballStep(CANNONBALL_LEFT));

    expect(calls).toEqual([
      'save()',
      'translate(86, 66)',
      'scale(-1, 1)',
      'set fillStyle(RGBA(255, 158, 61, 0.45))',
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
      'addColorStop(0, #7C8496)',
      'addColorStop(1, #171C26)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.55))',
      'beginPath()',
      'arc(-2, -2, 1.5, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });
});
