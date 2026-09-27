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
import { getFireballHeading } from './get-fireball-heading';
import { getFireballPosition } from './get-fireball-position';
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
  const at = getFireballPosition(fireball);

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
  it('should hang one fireball on the block when the block is a fireball one', () => {
    expect(
      createFireballs(
        level([
          [TILE_FIREBALL, TILE_AIR, TILE_FIREBALL],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toHaveLength(2);
  });

  it('should hang the fireball off the middle of its block when it creates one', () => {
    expect(
      createFireballs(
        level([
          [TILE_AIR, TILE_FIREBALL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      )[0].origin,
    ).toEqual({ x: TILE_SIZE * 1.5, y: TILE_SIZE / 2 });
  });

  it('should stagger the neighbours when fireball blocks stand side by side', () => {
    const fireballs = createFireballs(
      level([
        [TILE_FIREBALL, TILE_FIREBALL],
        [TILE_DIRT, TILE_DIRT],
      ]),
    );

    expect(fireballs[0].angle).not.toBe(fireballs[1].angle);
  });

  it('should send some fireballs round one way and some the other when it creates many', () => {
    expect(uniq(map(createFireballs(ROW_OF_BLOCKS), 'spin')).sort()).toEqual([
      'ANTICLOCKWISE',
      'CLOCKWISE',
    ]);
  });

  it('should roll the same spins again when the seed is the same', () => {
    expect(map(createFireballs(ROW_OF_BLOCKS), 'spin')).toEqual(
      map(createFireballs(ROW_OF_BLOCKS), 'spin'),
    );
  });

  it('should roll different spins when the seed differs', () => {
    expect(
      map(createFireballs({ ...ROW_OF_BLOCKS, seed: 'OTHER' }), 'spin'),
    ).not.toEqual(map(createFireballs(ROW_OF_BLOCKS), 'spin'));
  });
});

describe('stepFireball', () => {
  it('should hold the fireball five blocks out when it has flown a long way', () => {
    const [fireball] = createFireballs(level([[TILE_FIREBALL], [TILE_DIRT]]));

    expect(FIREBALL_ORBIT_RADIUS).toBe(FIREBALL_ORBIT_TILES * TILE_SIZE);
    times(40, (step) =>
      expect(
        radiusOf(spun(fireball, step / 10)),
        `after ${step / 10}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should come back around to where it started when it has flown one orbit', () => {
    forEach(SPINS, (spin) => {
      const start = getFireballPosition(turning(spin));
      const round = getFireballPosition(
        spun(turning(spin), FIREBALL_ORBIT_SECONDS),
      );

      expect(round.x, spin).toBeCloseTo(start.x, 1);
      expect(round.y, spin).toBeCloseTo(start.y, 1);
    });
  });

  it('should fly the same circle when the ring is walled in as when it is wide open', () => {
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

    expect(map(advanceFireballs(walled, 1), getFireballPosition)).toEqual(
      map(advanceFireballs(open, 1), getFireballPosition),
    );
  });
});

describe('stepFireball spin', () => {
  const START = turning('CLOCKWISE').origin;

  it('should carry the fireball downward off its three o clock start when it turns clockwise', () => {
    expect(
      getFireballPosition(spun(turning('CLOCKWISE'), 0.2)).y,
    ).toBeGreaterThan(START.y);
  });

  it('should carry the fireball upward off the same start when it turns anticlockwise', () => {
    expect(
      getFireballPosition(spun(turning('ANTICLOCKWISE'), 0.2)).y,
    ).toBeLessThan(START.y);
  });

  it('should mirror the one spin against the other when both start from the same angle', () => {
    const clockwise = getFireballPosition(spun(turning('CLOCKWISE'), 0.7));
    const anticlockwise = getFireballPosition(
      spun(turning('ANTICLOCKWISE'), 0.7),
    );

    expect(anticlockwise.x).toBeCloseTo(clockwise.x, 6);
    expect(anticlockwise.y - START.y).toBeCloseTo(START.y - clockwise.y, 6);
  });

  it('should hold the fireball five blocks out as well when it turns anticlockwise', () => {
    times(40, (step) =>
      expect(
        radiusOf(spun(turning('ANTICLOCKWISE'), step / 10)),
        `after ${step / 10}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should keep the angle inside a single turn when the fireball turns anticlockwise', () => {
    times(20, (step) => {
      const { angle } = spun(turning('ANTICLOCKWISE'), step / 4);

      expect(angle, `after ${step / 4}s`).toBeGreaterThanOrEqual(0);
      expect(angle, `after ${step / 4}s`).toBeLessThan(Math.PI * 2);
    });
  });
});

describe('getFireballHeading', () => {
  const QUARTER_TURN = Math.PI / 2;

  it('should point the fireball a quarter turn ahead when it turns clockwise', () => {
    const fireball = turning('CLOCKWISE');

    expect(getFireballHeading(fireball)).toBeCloseTo(
      fireball.angle + QUARTER_TURN,
    );
  });

  it('should point the fireball a quarter turn the other way when it turns anticlockwise', () => {
    const fireball = turning('ANTICLOCKWISE');

    expect(getFireballHeading(fireball)).toBeCloseTo(
      fireball.angle - QUARTER_TURN,
    );
  });

  it('should point each spin along the way it is really travelling when it heads off', () => {
    forEach(SPINS, (spin) => {
      const fireball = spun(turning(spin), 0.4);
      const from = getFireballPosition(fireball);
      const to = getFireballPosition(stepFireball(fireball, 0.001));
      const travel = Math.atan2(to.y - from.y, to.x - from.x);

      expect(Math.cos(getFireballHeading(fireball) - travel), spin).toBeCloseTo(
        1,
        4,
      );
    });
  });
});

describe('isBurning', () => {
  const [fireball] = createFireballs(level([[TILE_FIREBALL], [TILE_DIRT]]));

  const at = getFireballPosition(fireball);

  it('should scorch the player when they stand in the flame', () => {
    expect(
      isBurning(player(at.x - PLAYER_WIDTH / 2, at.y - PLAYER_HEIGHT / 2), [
        fireball,
      ]),
    ).toBe(true);
  });

  it('should spare the player when they stand clear of the flame', () => {
    expect(isBurning(player(at.x + TILE_SIZE * 3, at.y), [fireball])).toBe(
      false,
    );
  });

  it('should spare the player when they are still invincible', () => {
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
