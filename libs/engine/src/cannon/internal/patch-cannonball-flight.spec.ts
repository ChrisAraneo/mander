import { type Cannonball, type Level, TILE_SIZE } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SPEED } from '../consts';
import { patchCannonballFlight } from './patch-cannonball-flight';

const TICK_SECONDS = 0.02;
const BALL_LEFT = 100;

const TRAVELLED = CANNONBALL_SPEED * TICK_SECONDS;

const LEVEL: Level = {
  seed: 'SEED',
  width: 0,
  height: 0,
  tiles: [],
  chestItems: [],
};

const createCannonballs = (): Cannonball[] => [
  {
    position: { x: BALL_LEFT, y: TILE_SIZE },
    velocity: {
      x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
      y: { current: 0, max: CANNONBALL_SPEED },
    },
  },
];

describe('patchCannonballFlight', () => {
  it('should move every ball along by its speed when the tick is given', () => {
    const flight = patchCannonballFlight({
      cannonballs: createCannonballs(),
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(map(flight.cannonballs, (ball) => ball.position.x)).toEqual([
      BALL_LEFT + TRAVELLED,
    ]);
  });

  it('should give no balls when it is given none', () => {
    const flight = patchCannonballFlight({
      cannonballs: [],
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(flight.cannonballs).toEqual([]);
  });

  it('should pass the level on when it moves the balls', () => {
    const flight = patchCannonballFlight({
      cannonballs: createCannonballs(),
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(flight.level).toBe(LEVEL);
  });

  it('should not change the balls it was given when it moves them', () => {
    const cannonballs = createCannonballs();

    patchCannonballFlight({
      cannonballs,
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(cannonballs).toEqual(createCannonballs());
  });
});
