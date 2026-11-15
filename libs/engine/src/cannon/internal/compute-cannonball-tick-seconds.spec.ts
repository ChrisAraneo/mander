import { type Cannonball, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeCannonballTickSeconds } from './compute-cannonball-tick-seconds';

const SHORT_TICK = 0.02;
const LONG_TICK = 10;

const LEVEL: Level = {
  seed: 'SEED',
  width: 0,
  height: 0,
  tiles: [],
  chestItems: [],
};

describe('computeCannonballTickSeconds', () => {
  it('should keep the time that passed when the tick is short', () => {
    const plan = computeCannonballTickSeconds({
      cannonballs: [],
      level: LEVEL,
      deltaSeconds: SHORT_TICK,
    });

    expect(plan.tickSeconds).toBe(SHORT_TICK);
  });

  it('should cut the time down to the longest tick when a long time passed', () => {
    const plan = computeCannonballTickSeconds({
      cannonballs: [],
      level: LEVEL,
      deltaSeconds: LONG_TICK,
    });

    expect(plan.tickSeconds).toBe(MAX_TICK_SECONDS);
  });

  it('should pass the balls on when it is given none', () => {
    const cannonballs: Cannonball[] = [];

    const plan = computeCannonballTickSeconds({
      cannonballs,
      level: LEVEL,
      deltaSeconds: SHORT_TICK,
    });

    expect(plan.cannonballs).toBe(cannonballs);
  });

  it('should pass the level on when it works out the tick', () => {
    const plan = computeCannonballTickSeconds({
      cannonballs: [],
      level: LEVEL,
      deltaSeconds: SHORT_TICK,
    });

    expect(plan.level).toBe(LEVEL);
  });
});
