import { createPlayerFireballs } from '@mander/engine';
import { MOON_MAGNET } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { drawRecorded } from '../../test/draw-recorded';
import { drawPlayerFireballs } from './draw-player-fireballs';

const ROWS = ['.@..', '####'];

describe('drawPlayerFireballs', () => {
  it('should draw the white fireballs around the player when the moon magnet is carried', () => {
    const state = createRenderTestState(ROWS, { time: 0.5 });
    const circling = createRenderTestState(ROWS, {
      time: 0.5,
      playerFireballs: createPlayerFireballs([MOON_MAGNET], state.player),
    });

    const calls = drawRecorded((context) =>
      drawPlayerFireballs(context, circling),
    );

    expect(calls).toEqual([
      'save()',
      'translate(201.6, -24)',
      'rotate(1.5708)',
      'set fillStyle(RGBA(230, 238, 255, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 8.6307, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 8.6307)',
      'addColorStop(0, #FFFFFF)',
      'addColorStop(0.45, #F2F6FF)',
      'addColorStop(1, #B9C6E8)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFFFFF)',
      'beginPath()',
      'arc(0, 0, 3.3195, 0, 6.2832)',
      'fill()',
      'restore()',
      'save()',
      'translate(-105.6, -24)',
      'rotate(4.7124)',
      'set fillStyle(RGBA(230, 238, 255, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 7.3693, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 7.3693)',
      'addColorStop(0, #FFFFFF)',
      'addColorStop(0.45, #F2F6FF)',
      'addColorStop(1, #B9C6E8)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFFFFF)',
      'beginPath()',
      'arc(0, 0, 2.8343, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw nothing when no fireball circles the player', () => {
    const state = createRenderTestState(ROWS);

    const calls = drawRecorded((context) =>
      drawPlayerFireballs(context, state),
    );

    expect(calls).toEqual([]);
  });
});
