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
import { every, head, map, reduce, round, size, times, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import {
  FIREBALL_ORBIT_RADIUS,
  FIREBALL_ORBIT_SECONDS,
  FIREBALL_ORBIT_TILES,
  PINKBALL_ANGULAR_SPEED,
  PINKBALL_LOOPS,
  PINKBALL_LOOP_RADIUS,
  PINKBALL_LOOP_SECONDS,
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

const GERM_LOOP_TURN = (Math.PI * 2) / PINKBALL_LOOPS;

const GERM_SECONDS = PINKBALL_LOOPS * PINKBALL_LOOP_SECONDS;

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

const createFlyingFireball = (): Fireball => ({
  ...createTurningFireball('CLOCKWISE'),
  angle: 0,
});

const createLivingPinkball = (): Fireball => ({
  ...createFlyingFireball(),
  kind: 'PINK',
});

const computeStepLength = (fireball: Fireball, seconds: number): number =>
  pipe(
    nextFlight(fireball, seconds),
    (flown) => ({
      from: getFireballPosition(flown),
      to: getFireballPosition(nextFireball(flown, DELTA_SECONDS)),
    }),
    ({ from, to }) => Math.hypot(to.x - from.x, to.y - from.y),
  );

const ONE_STEP = PINKBALL_LOOP_RADIUS * PINKBALL_ANGULAR_SPEED * DELTA_SECONDS;

const computeGapFrom = (fireball: Fireball, direction: number): number =>
  pipe(getFireballPosition(fireball), (at) =>
    Math.hypot(
      at.x - fireball.origin.x - FIREBALL_ORBIT_RADIUS * Math.cos(direction),
      at.y - fireball.origin.y - FIREBALL_ORBIT_RADIUS * Math.sin(direction),
    ),
  );

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

  it('should take the pink ball round a whole loop while the fireball flies half its orbit', () => {
    expect(
      nextFlight(createLivingPinkball(), PINKBALL_LOOP_SECONDS).angle,
    ).toBeCloseTo(2 * Math.PI, 6);
    expect(
      nextFlight(createFlyingFireball(), PINKBALL_LOOP_SECONDS).angle,
    ).toBeCloseTo(Math.PI, 6);
  });

  it('should swing the pink ball out from its block to its furthest reach and back when it flies a loop', () => {
    expect(computeOrbitRadius(createLivingPinkball())).toBeCloseTo(0, 6);
    expect(
      computeOrbitRadius(
        nextFlight(createLivingPinkball(), PINKBALL_LOOP_SECONDS / 2),
      ),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS, 1);
    expect(
      computeOrbitRadius(
        nextFlight(createLivingPinkball(), PINKBALL_LOOP_SECONDS),
      ),
    ).toBeCloseTo(0, 3);
  });

  it('should bring the pink ball home to its block at the end of every loop', () =>
    times(PINKBALL_LOOPS, (loop) =>
      expect(
        computeOrbitRadius(
          nextFlight(
            createLivingPinkball(),
            (loop + 1) * PINKBALL_LOOP_SECONDS,
          ),
        ),
        `loop ${loop + 1}`,
      ).toBeCloseTo(0, 3),
    ));

  it('should turn each loop a sixth of a circle on from the last so the six of them ring the block', () =>
    times(PINKBALL_LOOPS, (loop) =>
      expect(
        computeGapFrom(
          nextFlight(
            createLivingPinkball(),
            (loop + 0.5) * PINKBALL_LOOP_SECONDS,
          ),
          loop * GERM_LOOP_TURN,
        ),
        `loop `,
      ).toBeLessThan(ONE_STEP),
    ));

  it('should set the pink ball off on the first loop again when it has flown all six', () => {
    expect(
      computeGapFrom(nextFlight(createLivingPinkball(), GERM_SECONDS), 0),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS, 1);
    expect(
      computeGapFrom(
        nextFlight(
          createLivingPinkball(),
          GERM_SECONDS + PINKBALL_LOOP_SECONDS / 2,
        ),
        0,
      ),
    ).toBeLessThan(ONE_STEP);
  });

  it('should hold the pink ball at one steady speed all the way round a loop', () => {
    const steps = map(times(60), (step) =>
      round(
        computeStepLength(
          createLivingPinkball(),
          (step * PINKBALL_LOOP_SECONDS) / 60,
        ),
        6,
      ),
    );

    expect(size(uniq(steps))).toBe(1);
  });

  it('should fly the pink ball at the same speed as the fireball flies', () => {
    expect(computeStepLength(createLivingPinkball(), 0)).toBeCloseTo(
      computeStepLength(createFlyingFireball(), 0),
      2,
    );
  });

  it('should keep the pink ball within five blocks of its block wherever it is on the germ', () =>
    expect(
      every(
        map(times(200), (step) =>
          computeOrbitRadius(
            nextFlight(createLivingPinkball(), (step * GERM_SECONDS) / 200),
          ),
        ),
        (reach) => reach <= FIREBALL_ORBIT_RADIUS,
      ),
    ).toBe(true));

  it('should keep the angle inside the germ cycle when the fireball turns anticlockwise', () => {
    const angles = times(
      20,
      (step) =>
        nextFlight(createTurningFireball('ANTICLOCKWISE'), step / 4).angle,
    );

    times(size(angles), (step) =>
      expect(angles[step], `after ${step / 4}s`).toBeGreaterThanOrEqual(0),
    );
    times(size(angles), (step) =>
      expect(angles[step], `after ${step / 4}s`).toBeLessThan(
        PINKBALL_LOOPS * 2 * Math.PI,
      ),
    );
  });
});
