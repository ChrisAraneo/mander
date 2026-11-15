import {
  type Fireball,
  type FireballSpin,
  type Level,
  type Point,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
} from '@mander/model';
import {
  every,
  floor,
  head,
  map,
  reduce,
  round,
  size,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeFireballPosition } from './compute-fireball-position';
import {
  FIREBALL_ORBIT_RADIUS,
  FIREBALL_ORBIT_SECONDS,
  FIREBALL_ORBIT_TILES,
  FULL_TURN,
  PINKBALL_ANGULAR_SPEED,
  PINKBALL_CYCLE_ANGLE,
  PINKBALL_CYCLE_SECONDS,
  PINKBALL_LOOPS,
  PINKBALL_LOOP_ANGLE,
  PINKBALL_LOOP_RADIUS,
  PINKBALL_LOOP_SECONDS,
  PINKBALL_SPEED_SCALE,
} from './consts';
import { createFireballs } from './create-fireballs';
import { nextFireball } from './next-fireball';
import { nextFireballs } from './next-fireballs';

const DELTA_SECONDS = 1 / 60;

const PRECISION = 6;

const COARSE_PRECISION = 1;

const LOOSE_PRECISION = 3;

const SPEED_PRECISION = 2;

const HALF_TURN = Math.PI;

const HALF_ORBIT_SECONDS = FIREBALL_ORBIT_SECONDS / 2;

const HALF_LOOP_SECONDS = PINKBALL_LOOP_SECONDS / 2;

const ON_BLOCK_RADIUS = 0;

const ONE_SPEED = 1;

const MID_LOOP_OFFSET = 0.5;

const FLIGHT_SAMPLES = 40;

const FLIGHT_SAMPLE_SECONDS = 1 / 10;

const STEP_SAMPLES = 60;

const CYCLE_SAMPLES = 200;

const WRAP_SAMPLES = 20;

const WRAP_SAMPLE_SECONDS = 1 / 4;

const SHORT_FLIGHT_SECONDS = 0.2;

const LONG_FLIGHT_SECONDS = 0.7;

const TICK_SECONDS = 1;

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(head(tiles)),
  height: size(tiles),
  tiles,
  chestItems: [],
});

const computeDistance = (from: Point, to: Point): number =>
  Math.hypot(to.x - from.x, to.y - from.y);

const computeOrbitRadius = (fireball: Fireball): number =>
  computeDistance(fireball.origin, computeFireballPosition(fireball));

const nextFlownFrames = (fireball: Fireball, frames: number): Fireball =>
  reduce(
    times(frames),
    (turning: Fireball) => nextFireball(turning, DELTA_SECONDS),
    fireball,
  );

const nextFlownFireball = (fireball: Fireball, seconds: number): Fireball =>
  nextFireball(
    nextFlownFrames(fireball, floor(seconds / DELTA_SECONDS)),
    seconds - floor(seconds / DELTA_SECONDS) * DELTA_SECONDS,
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

const computeFrameStep = (fireball: Fireball): number =>
  computeDistance(
    computeFireballPosition(fireball),
    computeFireballPosition(nextFireball(fireball, DELTA_SECONDS)),
  );

const computeStepLength = (fireball: Fireball, seconds: number): number =>
  computeFrameStep(nextFlownFireball(fireball, seconds));

const ONE_STEP = PINKBALL_LOOP_RADIUS * PINKBALL_ANGULAR_SPEED * DELTA_SECONDS;

const computeGapTo = (at: Point, origin: Point, direction: number): number =>
  Math.hypot(
    at.x - origin.x - FIREBALL_ORBIT_RADIUS * Math.cos(direction),
    at.y - origin.y - FIREBALL_ORBIT_RADIUS * Math.sin(direction),
  );

const computeGapFrom = (fireball: Fireball, direction: number): number =>
  computeGapTo(computeFireballPosition(fireball), fireball.origin, direction);

describe('nextFireball', () => {
  it('should hold the fireball five blocks out when it has flown a long way', () => {
    const [fireball] = createFireballs(
      createLevel([[TILE_FIREBALL], [TILE_DIRT]]),
    );

    expect(FIREBALL_ORBIT_RADIUS).toBe(FIREBALL_ORBIT_TILES * TILE_SIZE);
    times(FLIGHT_SAMPLES, (step) =>
      expect(
        computeOrbitRadius(
          nextFlownFireball(fireball, step * FLIGHT_SAMPLE_SECONDS),
        ),
        `after ${step * FLIGHT_SAMPLE_SECONDS}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should come back around to where it started when it has flown one orbit', () => {
    const starts = map(SPINS, (spin) =>
      computeFireballPosition(createTurningFireball(spin)),
    );
    const rounds = map(SPINS, (spin) =>
      computeFireballPosition(
        nextFlownFireball(createTurningFireball(spin), FIREBALL_ORBIT_SECONDS),
      ),
    );

    times(size(SPINS), (spinIndex) =>
      expect(rounds[spinIndex].x, SPINS[spinIndex]).toBeCloseTo(
        starts[spinIndex].x,
        COARSE_PRECISION,
      ),
    );
    times(size(SPINS), (spinIndex) =>
      expect(rounds[spinIndex].y, SPINS[spinIndex]).toBeCloseTo(
        starts[spinIndex].y,
        COARSE_PRECISION,
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

    expect(
      map(nextFireballs(walled, TICK_SECONDS), computeFireballPosition),
    ).toEqual(map(nextFireballs(open, TICK_SECONDS), computeFireballPosition));
  });

  it('should carry the fireball downward off its three o clock start when it turns clockwise', () => {
    expect(
      computeFireballPosition(
        nextFlownFireball(
          createTurningFireball('CLOCKWISE'),
          SHORT_FLIGHT_SECONDS,
        ),
      ).y,
    ).toBeGreaterThan(START.y);
  });

  it('should carry the fireball upward off the same start when it turns anticlockwise', () => {
    expect(
      computeFireballPosition(
        nextFlownFireball(
          createTurningFireball('ANTICLOCKWISE'),
          SHORT_FLIGHT_SECONDS,
        ),
      ).y,
    ).toBeLessThan(START.y);
  });

  it('should mirror the one spin against the other when both start from the same angle', () => {
    const clockwise = computeFireballPosition(
      nextFlownFireball(
        createTurningFireball('CLOCKWISE'),
        LONG_FLIGHT_SECONDS,
      ),
    );
    const anticlockwise = computeFireballPosition(
      nextFlownFireball(
        createTurningFireball('ANTICLOCKWISE'),
        LONG_FLIGHT_SECONDS,
      ),
    );

    expect(anticlockwise.x).toBeCloseTo(clockwise.x, PRECISION);
    expect(anticlockwise.y - START.y).toBeCloseTo(
      START.y - clockwise.y,
      PRECISION,
    );
  });

  it('should hold the fireball five blocks out as well when it turns anticlockwise', () => {
    times(FLIGHT_SAMPLES, (step) =>
      expect(
        computeOrbitRadius(
          nextFlownFireball(
            createTurningFireball('ANTICLOCKWISE'),
            step * FLIGHT_SAMPLE_SECONDS,
          ),
        ),
        `after ${step * FLIGHT_SAMPLE_SECONDS}s`,
      ).toBeCloseTo(FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should take the pink ball round a whole loop when it has flown one loop long', () => {
    expect(
      nextFlownFireball(createLivingPinkball(), PINKBALL_LOOP_SECONDS).angle,
    ).toBeCloseTo(FULL_TURN, PRECISION);
  });

  it('should leave the pink ball a fraction of the way round its loop when the fireball has flown half its orbit', () => {
    expect(
      nextFlownFireball(createLivingPinkball(), HALF_ORBIT_SECONDS).angle,
    ).toBeCloseTo(PINKBALL_SPEED_SCALE * FULL_TURN, PRECISION);
    expect(
      nextFlownFireball(createFlyingFireball(), HALF_ORBIT_SECONDS).angle,
    ).toBeCloseTo(HALF_TURN, PRECISION);
  });

  it('should swing the pink ball out from its block to its furthest reach and back when it flies a loop', () => {
    expect(computeOrbitRadius(createLivingPinkball())).toBeCloseTo(
      ON_BLOCK_RADIUS,
      PRECISION,
    );
    expect(
      computeOrbitRadius(
        nextFlownFireball(createLivingPinkball(), HALF_LOOP_SECONDS),
      ),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS, COARSE_PRECISION);
    expect(
      computeOrbitRadius(
        nextFlownFireball(createLivingPinkball(), PINKBALL_LOOP_SECONDS),
      ),
    ).toBeCloseTo(ON_BLOCK_RADIUS, LOOSE_PRECISION);
  });

  it('should bring the pink ball home to its block when it closes each of its loops', () =>
    times(PINKBALL_LOOPS, (loop) =>
      expect(
        computeOrbitRadius(
          nextFlownFireball(
            createLivingPinkball(),
            (loop + 1) * PINKBALL_LOOP_SECONDS,
          ),
        ),
        `loop ${loop + 1}`,
      ).toBeCloseTo(ON_BLOCK_RADIUS, LOOSE_PRECISION),
    ));

  it('should turn each loop a sixth of a circle on from the last when the six of them ring the block', () =>
    times(PINKBALL_LOOPS, (loop) =>
      expect(
        computeGapFrom(
          nextFlownFireball(
            createLivingPinkball(),
            (loop + MID_LOOP_OFFSET) * PINKBALL_LOOP_SECONDS,
          ),
          loop * PINKBALL_LOOP_ANGLE,
        ),
        `loop ${loop + 1}`,
      ).toBeLessThan(ONE_STEP),
    ));

  it('should set the pink ball off on the first loop again when it has flown all six', () => {
    expect(
      computeGapFrom(
        nextFlownFireball(createLivingPinkball(), PINKBALL_CYCLE_SECONDS),
        0,
      ),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS, COARSE_PRECISION);
    expect(
      computeGapFrom(
        nextFlownFireball(
          createLivingPinkball(),
          PINKBALL_CYCLE_SECONDS + HALF_LOOP_SECONDS,
        ),
        0,
      ),
    ).toBeLessThan(ONE_STEP);
  });

  it('should hold the pink ball at one steady speed when it flies all the way round a loop', () => {
    const steps = map(times(STEP_SAMPLES), (step) =>
      round(
        computeStepLength(
          createLivingPinkball(),
          (step * PINKBALL_LOOP_SECONDS) / STEP_SAMPLES,
        ),
        PRECISION,
      ),
    );

    expect(size(uniq(steps))).toBe(ONE_SPEED);
  });

  it('should fly the pink ball slower than the fireball when both set off from their blocks', () => {
    expect(computeStepLength(createLivingPinkball(), 0)).toBeCloseTo(
      PINKBALL_SPEED_SCALE * computeStepLength(createFlyingFireball(), 0),
      SPEED_PRECISION,
    );
  });

  it('should keep the pink ball within five blocks of its block when it flies the whole cycle', () =>
    expect(
      every(
        map(times(CYCLE_SAMPLES), (step) =>
          computeOrbitRadius(
            nextFlownFireball(
              createLivingPinkball(),
              (step * PINKBALL_CYCLE_SECONDS) / CYCLE_SAMPLES,
            ),
          ),
        ),
        (reach) => round(reach, PRECISION) <= FIREBALL_ORBIT_RADIUS,
      ),
    ).toBe(true));

  it('should keep the angle inside the pinkball cycle when the fireball turns anticlockwise', () => {
    const angles = times(
      WRAP_SAMPLES,
      (step) =>
        nextFlownFireball(
          createTurningFireball('ANTICLOCKWISE'),
          step * WRAP_SAMPLE_SECONDS,
        ).angle,
    );

    times(size(angles), (step) =>
      expect(
        angles[step],
        `after ${step * WRAP_SAMPLE_SECONDS}s`,
      ).toBeGreaterThanOrEqual(0),
    );
    times(size(angles), (step) =>
      expect(angles[step], `after ${step * WRAP_SAMPLE_SECONDS}s`).toBeLessThan(
        PINKBALL_CYCLE_ANGLE,
      ),
    );
  });

  it('should leave the fireball unchanged when it turns it', () => {
    const fireball = createFlyingFireball();

    nextFireball(fireball, DELTA_SECONDS);

    expect(fireball).toEqual(createFlyingFireball());
  });
});
