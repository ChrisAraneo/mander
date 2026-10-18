import { createPlayerFireballs } from '@mander/engine';
import {
  type Fireball,
  MOON_MAGNET,
  type Player,
  TILE_SIZE,
} from '@mander/model';
import { filter, find, last, map, split, startsWith, trimEnd } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { EMBER_FIREBALL } from './consts';
import { createFireballStep } from './create-fireball-step';
import { createPlayerFireballStep } from './create-player-fireball-step';

const CLOCKWISE_FIREBALL: Fireball = {
  spin: 'CLOCKWISE',
  origin: { x: 200, y: 200 },
  angle: 0,
};

const ANTICLOCKWISE_FIREBALL: Fireball = {
  spin: 'ANTICLOCKWISE',
  origin: { x: 96, y: 64 },
  angle: 1.2,
};

const STANDING: Player = {
  position: { x: 4 * TILE_SIZE, y: 2 * TILE_SIZE },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: true,
    isJumpQueued: false,
  },
};

const filterStopColours = (calls: string[]): string[] =>
  map(
    filter(calls, (call) => startsWith(call, 'addColorStop(')),
    (call) => trimEnd(last(split(call, ', ')), ')'),
  );

const findTranslation = (calls: string[]): string | undefined =>
  find(calls, (call) => startsWith(call, 'translate('));

describe('createFireballStep', () => {
  it('should draw the ember fireball on its orbit when it spins clockwise', () => {
    const calls = drawRecorded(createFireballStep(CLOCKWISE_FIREBALL, 0));

    expect(calls).toEqual([
      'save()',
      'translate(360, 200)',
      'rotate(1.5708)',
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 8, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 8)',
      'addColorStop(0, #FFF3C4)',
      'addColorStop(0.45, #FFB03A)',
      'addColorStop(1, #D8341C)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFF3C4)',
      'beginPath()',
      'arc(0, 0, 3.0769, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the ember fireball further round its orbit when it spins anticlockwise later on', () => {
    const calls = drawRecorded(createFireballStep(ANTICLOCKWISE_FIREBALL, 0.5));

    expect(calls).toEqual([
      'save()',
      'translate(153.9772, 213.1263)',
      'rotate(-0.3708)',
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 8.9031, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 8.9031)',
      'addColorStop(0, #FFF3C4)',
      'addColorStop(0.45, #FFB03A)',
      'addColorStop(1, #D8341C)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFF3C4)',
      'beginPath()',
      'arc(0, 0, 3.4243, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should keep the fireball burning in embers when it is bolted to the level', () => {
    expect(
      filterStopColours(
        drawRecorded(createFireballStep(CLOCKWISE_FIREBALL, 0)),
      ),
    ).toEqual([EMBER_FIREBALL.core, EMBER_FIREBALL.flame, EMBER_FIREBALL.edge]);
  });

  it('should keep the fireball out at its own orbit when it is bolted to the level', () => {
    const [circlingPlayer] = createPlayerFireballs([MOON_MAGNET], STANDING);

    expect(
      findTranslation(drawRecorded(createFireballStep(CLOCKWISE_FIREBALL, 0))),
    ).not.toEqual(
      findTranslation(
        drawRecorded(createPlayerFireballStep(circlingPlayer, 0)),
      ),
    );
  });
});
