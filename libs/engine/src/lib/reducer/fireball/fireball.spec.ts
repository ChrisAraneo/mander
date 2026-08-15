import {
  type Fireball,
  type FireballSpin,
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
} from '@mander/model';
import { forEach, map, reduce, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { advanceFireballs } from './advance-fireballs';
import {
  FIREBALL_ORBIT_RADIUS,
  FIREBALL_ORBIT_SECONDS,
  FIREBALL_ORBIT_TILES,
} from './consts';
import { createFireballs } from './create-fireballs';
import { fireballHeading } from './fireball-heading';
import { fireballPosition } from './fireball-position';
import { isBurning } from './is-burning';
import { stepFireball } from './step-fireball';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

const DELTA_SECONDS = 1 / 60;

const player = (x: number, y: number, invincibility = 0): Player => ({
  position: { x, y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});

const radiusOf = (fireball: Fireball): number => {
  const at = fireballPosition(fireball);

  return Math.hypot(at.x - fireball.origin.x, at.y - fireball.origin.y);
};

const spun = (fireball: Fireball, seconds: number): Fireball =>
  reduce(
    times(Math.round(seconds / DELTA_SECONDS)),
    (turning: Fireball) => stepFireball(turning, DELTA_SECONDS),
    fireball,
  );

const ONE_BLOCK = level([[TILE_FIREBALL], [TILE_DIRT]]);

const ROW_OF_BLOCKS = level([
  times(12, () => TILE_FIREBALL),
  times(12, () => TILE_DIRT),
]);

const SPINS: FireballSpin[] = ['CLOCKWISE', 'ANTICLOCKWISE'];

const turning = (spin: FireballSpin): Fireball => ({
  ...createFireballs(ONE_BLOCK)[0],
  spin,
});

describe('createFireballs', () => {
  it('should hang one fireball on every fireball block', () => {
    expect(
      createFireballs(
        level([
          [TILE_FIREBALL, TILE_AIR, TILE_FIREBALL],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toHaveLength(2);
  });

  it('should hang the fireball off the middle of its block', () => {
    expect(
      createFireballs(
        level([
          [TILE_AIR, TILE_FIREBALL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      )[0].origin,
    ).toEqual({ x: TILE_SIZE * 1.5, y: TILE_SIZE / 2 });
  });

  it('should stagger neighbours so they do not fly in lockstep', () => {
    const fireballs = createFireballs(
      level([
        [TILE_FIREBALL, TILE_FIREBALL],
        [TILE_DIRT, TILE_DIRT],
      ]),
    );

    expect(fireballs[0].angle).not.toBe(fireballs[1].angle);
  });

  it('should send some fireballs round one way and some the other', () => {
    expect(uniq(map(createFireballs(ROW_OF_BLOCKS), 'spin')).sort()).toEqual([
      'ANTICLOCKWISE',
      'CLOCKWISE',
    ]);
  });

  it('should roll the same spins again for the same seed, so a respawn matches', () => {
    expect(map(createFireballs(ROW_OF_BLOCKS), 'spin')).toEqual(
      map(createFireballs(ROW_OF_BLOCKS), 'spin'),
    );
  });

  it('should roll different spins for a different seed', () => {
    expect(
      map(createFireballs({ ...ROW_OF_BLOCKS, seed: 'OTHER' }), 'spin'),
    ).not.toEqual(map(createFireballs(ROW_OF_BLOCKS), 'spin'));
  });
});

describe('stepFireball', () => {
  it('should hold the fireball five blocks out however far it has flown', () => {
    const [fireball] = createFireballs(level([[TILE_FIREBALL], [TILE_DIRT]]));

    expect(FIREBALL_ORBIT_RADIUS).toBe(FIREBALL_ORBIT_TILES * TILE_SIZE);
    times(40, (step) =>
      expect(
        radiusOf(spun(fireball, step / 10)),
        `after ${step / 10}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should come back around to where it started after one orbit', () => {
    forEach(SPINS, (spin) => {
      const start = fireballPosition(turning(spin));
      const round = fireballPosition(
        spun(turning(spin), FIREBALL_ORBIT_SECONDS),
      );

      expect(round.x, spin).toBeCloseTo(start.x, 1);
      expect(round.y, spin).toBeCloseTo(start.y, 1);
    });
  });

  it('should fly the same circle whether the ring is walled in or wide open', () => {
    const walled = createFireballs(
      level([
        [TILE_DIRT, TILE_FIREBALL, TILE_DIRT],
        [TILE_DIRT, TILE_DIRT, TILE_DIRT],
      ]),
    );
    const open = createFireballs(
      level([
        [TILE_AIR, TILE_FIREBALL, TILE_AIR],
        [TILE_AIR, TILE_AIR, TILE_AIR],
      ]),
    );

    expect(map(advanceFireballs(walled, 1), fireballPosition)).toEqual(
      map(advanceFireballs(open, 1), fireballPosition),
    );
  });
});

describe('stepFireball spin', () => {
  const START = turning('CLOCKWISE').origin;

  it('should carry the clockwise fireball downward off its three o clock start', () => {
    expect(fireballPosition(spun(turning('CLOCKWISE'), 0.2)).y).toBeGreaterThan(
      START.y,
    );
  });

  it('should carry the anticlockwise fireball upward off the same start', () => {
    expect(
      fireballPosition(spun(turning('ANTICLOCKWISE'), 0.2)).y,
    ).toBeLessThan(START.y);
  });

  it('should mirror the one spin against the other', () => {
    const clockwise = fireballPosition(spun(turning('CLOCKWISE'), 0.7));
    const anticlockwise = fireballPosition(spun(turning('ANTICLOCKWISE'), 0.7));

    expect(anticlockwise.x).toBeCloseTo(clockwise.x, 6);
    expect(anticlockwise.y - START.y).toBeCloseTo(START.y - clockwise.y, 6);
  });

  it('should hold the anticlockwise fireball five blocks out as well', () => {
    times(40, (step) =>
      expect(
        radiusOf(spun(turning('ANTICLOCKWISE'), step / 10)),
        `after ${step / 10}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should keep the anticlockwise angle inside a single turn', () => {
    times(20, (step) => {
      const { angle } = spun(turning('ANTICLOCKWISE'), step / 4);

      expect(angle, `after ${step / 4}s`).toBeGreaterThanOrEqual(0);
      expect(angle, `after ${step / 4}s`).toBeLessThan(Math.PI * 2);
    });
  });
});

describe('fireballHeading', () => {
  const QUARTER_TURN = Math.PI / 2;

  it('should point the clockwise fireball a quarter turn ahead', () => {
    const fireball = turning('CLOCKWISE');

    expect(fireballHeading(fireball)).toBeCloseTo(
      fireball.angle + QUARTER_TURN,
    );
  });

  it('should point the anticlockwise fireball a quarter turn the other way', () => {
    const fireball = turning('ANTICLOCKWISE');

    expect(fireballHeading(fireball)).toBeCloseTo(
      fireball.angle - QUARTER_TURN,
    );
  });

  it('should point each spin along the way it is really travelling', () => {
    forEach(SPINS, (spin) => {
      const fireball = spun(turning(spin), 0.4);
      const from = fireballPosition(fireball);
      const to = fireballPosition(stepFireball(fireball, 0.001));
      const travel = Math.atan2(to.y - from.y, to.x - from.x);

      expect(Math.cos(fireballHeading(fireball) - travel), spin).toBeCloseTo(
        1,
        4,
      );
    });
  });
});

describe('isBurning', () => {
  const [fireball] = createFireballs(level([[TILE_FIREBALL], [TILE_DIRT]]));

  const at = fireballPosition(fireball);

  it('should scorch the player standing in the flame', () => {
    expect(
      isBurning(player(at.x - PLAYER_WIDTH / 2, at.y - PLAYER_HEIGHT / 2), [
        fireball,
      ]),
    ).toBe(true);
  });

  it('should spare the player standing clear of it', () => {
    expect(isBurning(player(at.x + TILE_SIZE * 3, at.y), [fireball])).toBe(
      false,
    );
  });

  it('should spare the player who is still invincible', () => {
    expect(
      isBurning(
        player(at.x - PLAYER_WIDTH / 2, at.y - PLAYER_HEIGHT / 2, 1.5),
        [fireball],
      ),
    ).toBe(false);
  });

  it('should spare the player when nothing is burning', () => {
    expect(isBurning(player(at.x, at.y), [])).toBe(false);
  });
});
