import {
  type Fireball,
  type FireballSpin,
  type Level,
  type Point,
  type Tile,
  TILE_DIRT,
  TILE_FIREBALL,
} from '@mander/model';
import { head, map, reduce, round, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFireballs } from './create-fireballs';
import { getFireballHeading } from './get-fireball-heading';
import { getFireballPosition } from './get-fireball-position';
import { nextFireball } from './next-fireball';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(head(tiles)),
  height: size(tiles),
  tiles,
  chestItems: [],
});

const DELTA_SECONDS = 1 / 60;

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

const computeAngleBetween = (from: Point, to: Point): number =>
  Math.atan2(to.y - from.y, to.x - from.x);

const computeTravelAngle = (fireball: Fireball): number =>
  computeAngleBetween(
    getFireballPosition(fireball),
    getFireballPosition(nextFireball(fireball, 0.001)),
  );

const QUARTER_TURN = Math.PI / 2;

describe('getFireballHeading', () => {
  it('should point the fireball a quarter turn ahead when it turns clockwise', () => {
    const fireball = createTurningFireball('CLOCKWISE');

    expect(getFireballHeading(fireball)).toBeCloseTo(
      fireball.angle + QUARTER_TURN,
    );
  });

  it('should point the fireball a quarter turn the other way when it turns anticlockwise', () => {
    const fireball = createTurningFireball('ANTICLOCKWISE');

    expect(getFireballHeading(fireball)).toBeCloseTo(
      fireball.angle - QUARTER_TURN,
    );
  });

  it('should point each spin along the way it is really travelling when it heads off', () => {
    const fireballs = map(SPINS, (spin) =>
      nextFlight(createTurningFireball(spin), 0.4),
    );

    times(size(SPINS), (spinIndex) =>
      expect(
        Math.cos(
          getFireballHeading(fireballs[spinIndex]) -
            computeTravelAngle(fireballs[spinIndex]),
        ),
        SPINS[spinIndex],
      ).toBeCloseTo(1, 4),
    );
  });
});
