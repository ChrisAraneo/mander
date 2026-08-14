import {
  type Fireball,
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
} from '@mander/model';
import { map, reduce, times } from 'lodash-es';
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
    const [fireball] = createFireballs(level([[TILE_FIREBALL], [TILE_DIRT]]));
    const start = fireballPosition(fireball);
    const round = fireballPosition(spun(fireball, FIREBALL_ORBIT_SECONDS));

    expect(round.x).toBeCloseTo(start.x, 1);
    expect(round.y).toBeCloseTo(start.y, 1);
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
