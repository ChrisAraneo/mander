import {
  createPlayerFireballs,
  getPlayerFireballPosition,
} from '@mander/engine';
import { type Fireball, MOON_MAGNET, type Player, TILE_SIZE, chain } from '@mander/model';
import { filter, find, map, some, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import type { CanvasCall } from '../../test/types/canvas-call';
import { draw } from '../canvas/draw';
import type { CanvasStep } from '../types/canvas-step';
import { EMBER_FIREBALL, WHITE_FIREBALL } from './consts';
import { createPlayerFireballStep } from './create-player-fireball-step';

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

const drawCalls = (step: CanvasStep): CanvasCall[] =>
  chain(createRecordingContext())
    .thru((recording) =>
      tap(recording, ({ context }) => draw(context, step)),
    )
    .thru(({ calls }) => calls)
    .value();

const filterStopColours = (calls: CanvasCall[]): unknown[] =>
  map(
    filter(calls, (call) => call.name === 'addColorStop'),
    (call) => call.args[1],
  );

const findTranslation = (calls: CanvasCall[]): CanvasCall | undefined =>
  find(calls, (call) => call.name === 'translate');

const createCirclingFireballs = (): Fireball[] =>
  createPlayerFireballs([MOON_MAGNET], STANDING);

describe('createPlayerFireballStep', () => {
  it('should paint the fireball white rather than in embers when it circles the player', () => {
    const colors = filterStopColours(
      drawCalls(createPlayerFireballStep(createCirclingFireballs()[0], 0)),
    );

    expect(colors).toEqual([
      WHITE_FIREBALL.core,
      WHITE_FIREBALL.flame,
      WHITE_FIREBALL.edge,
    ]);
    expect(some(colors, (color) => color === EMBER_FIREBALL.flame)).toBe(false);
  });

  it('should paint the fireball where it orbits when it circles the player', () => {
    const [fireball] = createCirclingFireballs();
    const at = getPlayerFireballPosition(fireball);

    expect(
      findTranslation(drawCalls(createPlayerFireballStep(fireball, 0)))?.args,
    ).toEqual([at.x, at.y]);
  });

  it('should paint the two of them apart when both circle the player', () => {
    const [first, second] = createCirclingFireballs();

    expect(
      findTranslation(drawCalls(createPlayerFireballStep(first, 0)))?.args,
    ).not.toEqual(
      findTranslation(drawCalls(createPlayerFireballStep(second, 0)))?.args,
    );
  });
});
