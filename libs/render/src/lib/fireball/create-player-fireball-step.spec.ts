import {
  createPlayerFireballs,
  getPlayerFireballPosition,
} from '@mander/engine';
import {
  type Fireball,
  MOON_MAGNET,
  type Player,
  TILE_SIZE,
} from '@mander/model';
import { filter, map, some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { type CanvasStep, paint } from '../canvas';
import { EMBER_FIREBALL, WHITE_FIREBALL } from './fireball-colors';
import { createFireballStep } from './create-fireball-step';
import { createPlayerFireballStep } from './create-player-fireball-step';

interface Call {
  name: string;
  args: unknown[];
}

interface Recorder {
  context: CanvasRenderingContext2D;
  calls: Call[];
}

const recorder = (): Recorder => {
  const calls: Call[] = [];
  const record =
    (name: string) =>
    (...args: unknown[]): void => {
      calls.push({ name, args });
    };

  const context = {
    save: record('save'),
    restore: record('restore'),
    translate: record('translate'),
    rotate: record('rotate'),
    beginPath: record('beginPath'),
    arc: record('arc'),
    ellipse: record('ellipse'),
    fill: record('fill'),
    stroke: record('stroke'),
    createRadialGradient: (...args: unknown[]) => {
      calls.push({ name: 'createRadialGradient', args });

      return { addColorStop: record('addColorStop') };
    },
  };

  return { context: context as unknown as CanvasRenderingContext2D, calls };
};

const painted = (step: CanvasStep): Call[] => {
  const { context, calls } = recorder();

  paint(context, step);

  return calls;
};

const colorsIn = (calls: Call[]): unknown[] =>
  map(filter(calls, { name: 'addColorStop' }), ({ args }) => args[1]);

const movedTo = (calls: Call[]): Call | undefined =>
  filter(calls, { name: 'translate' })[0];

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

const circling = (): Fireball[] =>
  createPlayerFireballs([MOON_MAGNET], STANDING);

describe('createPlayerFireballStep', () => {
  it('paints the fireball white rather than in embers', () => {
    const colors = colorsIn(
      painted(createPlayerFireballStep(circling()[0], 0)),
    );

    expect(colors).toEqual([
      WHITE_FIREBALL.core,
      WHITE_FIREBALL.flame,
      WHITE_FIREBALL.edge,
    ]);
    expect(some(colors, (color) => color === EMBER_FIREBALL.flame)).toBe(false);
  });

  it('paints it where it orbits the player', () => {
    const [fireball] = circling();
    const at = getPlayerFireballPosition(fireball);

    expect(
      movedTo(painted(createPlayerFireballStep(fireball, 0)))?.args,
    ).toEqual([at.x, at.y]);
  });

  it('paints the two of them apart from one another', () => {
    const [first, second] = circling();

    expect(
      movedTo(painted(createPlayerFireballStep(first, 0)))?.args,
    ).not.toEqual(movedTo(painted(createPlayerFireballStep(second, 0)))?.args);
  });
});

describe('createFireballStep', () => {
  const bolted: Fireball = {
    spin: 'CLOCKWISE',
    origin: { x: 200, y: 200 },
    angle: 0,
  };

  it('keeps the fireballs in the level burning in embers', () => {
    expect(colorsIn(painted(createFireballStep(bolted, 0)))).toEqual([
      EMBER_FIREBALL.core,
      EMBER_FIREBALL.flame,
      EMBER_FIREBALL.edge,
    ]);
  });

  it('keeps them out at the orbit their own block gives them', () => {
    const [circlingPlayer] = circling();

    expect(movedTo(painted(createFireballStep(bolted, 0)))?.args).not.toEqual(
      movedTo(painted(createPlayerFireballStep(circlingPlayer, 0)))?.args,
    );
  });
});
