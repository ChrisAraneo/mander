import { type Bullet, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeBulletTickSeconds } from './compute-bullet-tick-seconds';

const SHORT_TICK = 0.02;
const LONG_TICK = 10;

const LEVEL: Level = {
  seed: 'SEED',
  width: 0,
  height: 0,
  tiles: [],
  chestItems: [],
};

describe('computeBulletTickSeconds', () => {
  it('should keep the time that passed when the tick is short', () => {
    const plan = computeBulletTickSeconds({
      bullets: [],
      level: LEVEL,
      elapsedSeconds: SHORT_TICK,
    });

    expect(plan.tickSeconds).toBe(SHORT_TICK);
  });

  it('should cut the time down to the longest tick when a long time passed', () => {
    const plan = computeBulletTickSeconds({
      bullets: [],
      level: LEVEL,
      elapsedSeconds: LONG_TICK,
    });

    expect(plan.tickSeconds).toBe(MAX_TICK_SECONDS);
  });

  it('should pass the bullets on when it is given none', () => {
    const bullets: Bullet[] = [];

    const plan = computeBulletTickSeconds({
      bullets,
      level: LEVEL,
      elapsedSeconds: SHORT_TICK,
    });

    expect(plan.bullets).toBe(bullets);
  });

  it('should pass the level on when it works out the tick', () => {
    const plan = computeBulletTickSeconds({
      bullets: [],
      level: LEVEL,
      elapsedSeconds: SHORT_TICK,
    });

    expect(plan.level).toBe(LEVEL);
  });
});
