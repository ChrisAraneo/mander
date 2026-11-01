import {
  type Fireball,
  type FireballSpin,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
} from '@mander/model';
import { head, map, reduce, round, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import {
  FIREBALL_ORBIT_RADIUS,
  FIREBALL_ORBIT_SECONDS,
  FIREBALL_ORBIT_TILES,
  PINKBALL_SPIRAL_RADIUS,
  PINKBALL_SPIRAL_TURNS,
} from './consts';
import { createFireballs } from './create-fireballs';
import { getFireballPosition } from './get-fireball-position';
import { nextFireball } from './next-fireball';
import { nextFireballs } from './next-fireballs';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(head(tiles)),
  height: size(tiles),
  tiles,
  chestItems: [],
});

const DELTA_SECONDS = 1 / 60;

const computeOrbitRadius = (fireball: Fireball): number =>
  pipe(fireball, getFireballPosition, (orbiting) =>
    Math.hypot(orbiting.x - fireball.origin.x, orbiting.y - fireball.origin.y),
  );

const nextFlight = (fireball: Fireball, seconds: number): Fireball =>
  reduce(
    times(round(seconds / DELTA_SECONDS)),
    (turning: Fireball) => nextFireball(turning, DELTA_SECONDS),
    fireball,
  );

const ONE_BLOCK = createLevel([[TILE_FIREBALL], [TILE_DIRT]]);

const SPINS: FireballSpin[] = ['CLOCKWISE', 'ANTICLOCKWISE'];

const createTurningFireball = (spin: FireballSpin): Fireball => ({
  ...createFireballs(ONE_BLOCK)[0],
  spin,
});

const START = createTurningFireball('CLOCKWISE').origin;

const SPIRAL_ARM_SECONDS = PINKBALL_SPIRAL_TURNS * FIREBALL_ORBIT_SECONDS;

const createSpirallingPinkball = (): Fireball => ({
  ...createTurningFireball('CLOCKWISE'),
  kind: 'PINK',
  angle: 0,
});

describe('nextFireball', () => {
  it('should hold the fireball five blocks out when it has flown a long way', () => {
    const [fireball] = createFireballs(
      createLevel([[TILE_FIREBALL], [TILE_DIRT]]),
    );

    expect(FIREBALL_ORBIT_RADIUS).toBe(FIREBALL_ORBIT_TILES * TILE_SIZE);
    times(40, (step) =>
      expect(
        computeOrbitRadius(nextFlight(fireball, step / 10)),
        `after ${step / 10}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should come back around to where it started when it has flown one orbit', () => {
    const starts = map(SPINS, (spin) =>
      getFireballPosition(createTurningFireball(spin)),
    );
    const rounds = map(SPINS, (spin) =>
      getFireballPosition(
        nextFlight(createTurningFireball(spin), FIREBALL_ORBIT_SECONDS),
      ),
    );

    times(size(SPINS), (spinIndex) =>
      expect(rounds[spinIndex].x, SPINS[spinIndex]).toBeCloseTo(
        starts[spinIndex].x,
        1,
      ),
    );
    times(size(SPINS), (spinIndex) =>
      expect(rounds[spinIndex].y, SPINS[spinIndex]).toBeCloseTo(
        starts[spinIndex].y,
        1,
      ),
    );
  });

  it('should fly the same circle when the ring is walled in as when it is wide open', () => {
    const walled = createFireballs(
      createLevel([
        [TILE_DIRT, TILE_FIREBALL, TILE_DIRT],
        [TILE_DIRT, TILE_DIRT, TILE_DIRT],
      ]),
    );
    const open = createFireballs(
      createLevel([
        [TILE_AIR, TILE_FIREBALL, TILE_AIR],
        [TILE_AIR, TILE_AIR, TILE_AIR],
      ]),
    );

    expect(map(nextFireballs(walled, 1), getFireballPosition)).toEqual(
      map(nextFireballs(open, 1), getFireballPosition),
    );
  });

  it('should carry the fireball downward off its three o clock start when it turns clockwise', () => {
    expect(
      getFireballPosition(nextFlight(createTurningFireball('CLOCKWISE'), 0.2))
        .y,
    ).toBeGreaterThan(START.y);
  });

  it('should carry the fireball upward off the same start when it turns anticlockwise', () => {
    expect(
      getFireballPosition(
        nextFlight(createTurningFireball('ANTICLOCKWISE'), 0.2),
      ).y,
    ).toBeLessThan(START.y);
  });

  it('should mirror the one spin against the other when both start from the same angle', () => {
    const clockwise = getFireballPosition(
      nextFlight(createTurningFireball('CLOCKWISE'), 0.7),
    );
    const anticlockwise = getFireballPosition(
      nextFlight(createTurningFireball('ANTICLOCKWISE'), 0.7),
    );

    expect(anticlockwise.x).toBeCloseTo(clockwise.x, 6);
    expect(anticlockwise.y - START.y).toBeCloseTo(START.y - clockwise.y, 6);
  });

  it('should hold the fireball five blocks out as well when it turns anticlockwise', () => {
    times(40, (step) =>
      expect(
        computeOrbitRadius(
          nextFlight(createTurningFireball('ANTICLOCKWISE'), step / 10),
        ),
        `after ${step / 10}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should wind the pink ball in to its closest point when it has flown one arm of the spiral', () => {
    expect(
      computeOrbitRadius(
        nextFlight(createSpirallingPinkball(), SPIRAL_ARM_SECONDS),
      ),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS - PINKBALL_SPIRAL_RADIUS, 0);
  });

  it('should wind the pink ball back out to the full orbit when it has flown the whole cycle', () => {
    expect(
      computeOrbitRadius(
        nextFlight(createSpirallingPinkball(), 2 * SPIRAL_ARM_SECONDS),
      ),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS, 0);
  });

  it('should draw the pink ball steadily inwards when it flies the first arm of the spiral', () => {
    const reaches = map(times(6), (step) =>
      computeOrbitRadius(
        nextFlight(createSpirallingPinkball(), (step * SPIRAL_ARM_SECONDS) / 5),
      ),
    );

    times(5, (step) =>
      expect(reaches[step + 1], `after  steps`).toBeLessThan(reaches[step]),
    );
  });

  it('should keep the angle inside the spiral cycle when the fireball turns anticlockwise', () => {
    const angles = times(
      20,
      (step) =>
        nextFlight(createTurningFireball('ANTICLOCKWISE'), step / 4).angle,
    );

    times(size(angles), (step) =>
      expect(angles[step], `after ${step / 4}s`).toBeGreaterThanOrEqual(0),
    );
    times(size(angles), (step) =>
      expect(angles[step], `after -es`).toBeLessThan(
        2 * PINKBALL_SPIRAL_TURNS * 2 * Math.PI,
      ),
    );
  });
});
