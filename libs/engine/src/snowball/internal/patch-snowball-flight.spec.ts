import {
  type Snowball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { SNOWBALL_SPEED } from '../consts';
import { patchSnowballFlight } from './patch-snowball-flight';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['..........', '..........', '##########']);

const TICK_SECONDS = 0.02;

const FLYING_RIGHT_X = 100;

const FLYING_LEFT_X = 200;

const EXPECTED_SNOWBALLS = 2;

const PRECISION = 6;

const createSnowball = (left: number, speed: number): Snowball => ({
  position: { x: left, y: TILE_SIZE },
  velocity: { x: { current: speed, max: SNOWBALL_SPEED } },
});

const createSnowballs = (): Snowball[] => [
  createSnowball(FLYING_RIGHT_X, SNOWBALL_SPEED),
  createSnowball(FLYING_LEFT_X, -SNOWBALL_SPEED),
];

describe('patchSnowballFlight', () => {
  it('should move every snowball along by its speed when the tick passes', () => {
    const flight = patchSnowballFlight({
      snowballs: createSnowballs(),
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(size(flight.snowballs)).toBe(EXPECTED_SNOWBALLS);
    expect(flight.snowballs[0].position.x).toBeCloseTo(
      FLYING_RIGHT_X + SNOWBALL_SPEED * TICK_SECONDS,
      PRECISION,
    );
    expect(flight.snowballs[1].position.x).toBeCloseTo(
      FLYING_LEFT_X - SNOWBALL_SPEED * TICK_SECONDS,
      PRECISION,
    );
  });

  it('should keep the height and the speed of a snowball when it flies', () => {
    const flight = patchSnowballFlight({
      snowballs: createSnowballs(),
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(flight.snowballs[0].position.y).toBe(TILE_SIZE);
    expect(flight.snowballs[0].velocity).toEqual({
      x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED },
    });
  });

  it('should pass the same level on when the snowballs fly', () => {
    const flight = patchSnowballFlight({
      snowballs: createSnowballs(),
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(flight.level).toBe(LEVEL);
  });

  it('should give no snowballs when there are none in the air', () => {
    const flight = patchSnowballFlight({
      snowballs: [],
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(flight.snowballs).toEqual([]);
  });

  it('should leave the given snowballs alone when they fly', () => {
    const snowballs = createSnowballs();

    patchSnowballFlight({
      snowballs,
      level: LEVEL,
      tickSeconds: TICK_SECONDS,
    });

    expect(snowballs).toEqual(createSnowballs());
  });
});
