import type { Fireball } from '@mander/model';
import {
  filter,
  includes,
  last,
  map,
  split,
  startsWith,
  trimEnd,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { BLOSSOM_FIREBALL, EMBER_FIREBALL, FROST_FIREBALL } from './consts';
import { createFireballStep } from './create-fireball-step';

const CLOCKWISE_FIREBALL: Fireball = {
  kind: 'FIRE',
  spin: 'CLOCKWISE',
  origin: { x: 200, y: 200 },
  angle: 0,
};

const ANTICLOCKWISE_FIREBALL: Fireball = {
  kind: 'FIRE',
  spin: 'ANTICLOCKWISE',
  origin: { x: 96, y: 64 },
  angle: 1.2,
};

const filterStopColours = (calls: string[]): string[] =>
  map(
    filter(calls, (call) => startsWith(call, 'addColorStop(')),
    (call) => trimEnd(last(split(call, ', ')), ')'),
  );

describe('createFireballStep', () => {
  it('should draw the ember fireball on its orbit when it spins clockwise', () => {
    const calls = drawRecorded(createFireballStep(CLOCKWISE_FIREBALL, 0));

    expect(calls).toEqual([
      'save()',
      'translate(360, 200)',
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

  it('should draw the ice ball in frost when it is an icy one', () => {
    expect(
      filterStopColours(
        drawRecorded(
          createFireballStep({ ...CLOCKWISE_FIREBALL, kind: 'ICE' }, 0),
        ),
      ),
    ).toEqual([FROST_FIREBALL.core, FROST_FIREBALL.flame, FROST_FIREBALL.edge]);
  });

  it('should drag no tail behind the ice ball when it draws one', () => {
    expect(
      filter(
        drawRecorded(
          createFireballStep({ ...CLOCKWISE_FIREBALL, kind: 'ICE' }, 0),
        ),
        (call) => includes(call, 'ellipse('),
      ),
    ).toEqual([]);
  });

  it('should draw the pink ball in blossom when it is a pink one', () => {
    expect(
      filterStopColours(
        drawRecorded(
          createFireballStep({ ...CLOCKWISE_FIREBALL, kind: 'PINK' }, 0),
        ),
      ),
    ).toEqual([
      BLOSSOM_FIREBALL.core,
      BLOSSOM_FIREBALL.flame,
      BLOSSOM_FIREBALL.edge,
    ]);
  });

  it('should keep the fireball burning in embers when it is bolted to the level', () => {
    expect(
      filterStopColours(
        drawRecorded(createFireballStep(CLOCKWISE_FIREBALL, 0)),
      ),
    ).toEqual([EMBER_FIREBALL.core, EMBER_FIREBALL.flame, EMBER_FIREBALL.edge]);
  });
});
