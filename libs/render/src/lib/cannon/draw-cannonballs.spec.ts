import type { Cannonball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawCannonballs } from './draw-cannonballs';

const ROWS = ['.@..', '####'];

const CANNONBALLS: Cannonball[] = [
  { position: { x: 200, y: 40 }, velocity: { x: { current: 220, max: 220 } } },
  { position: { x: 80, y: 60 }, velocity: { x: { current: -220, max: 220 } } },
];

describe('drawCannonballs', () => {
  it('should draw every cannonball in order when two are in flight', () => {
    const state = createRenderTestState(ROWS, { cannonballs: CANNONBALLS });

    const calls = drawRecorded((context) => drawCannonballs(context, state));

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

  it('should draw nothing when no cannonball is in flight', () => {
    const state = createRenderTestState(ROWS);

    const calls = drawRecorded((context) => drawCannonballs(context, state));

    expect(calls).toEqual([]);
  });
});
