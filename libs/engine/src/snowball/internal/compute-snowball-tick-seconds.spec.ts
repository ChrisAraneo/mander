import {
  MAX_TICK_SECONDS,
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
import { computeSnowballTickSeconds } from './compute-snowball-tick-seconds';

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

const DELTA_SECONDS = 0.02;

const LONG_DELTA_SECONDS = 10;

const SNOWBALL_X = 100;

const SNOWBALLS: Snowball[] = [
  {
    position: { x: SNOWBALL_X, y: TILE_SIZE },
    velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
  },
];

describe('computeSnowballTickSeconds', () => {
  it('should give the time that passed when it is shorter than the longest tick', () => {
    const plan = computeSnowballTickSeconds({
      snowballs: SNOWBALLS,
      level: LEVEL,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(plan.tickSeconds).toBe(DELTA_SECONDS);
  });

  it('should give the longest tick when more time than that passed', () => {
    const plan = computeSnowballTickSeconds({
      snowballs: SNOWBALLS,
      level: LEVEL,
      deltaSeconds: LONG_DELTA_SECONDS,
    });

    expect(plan.tickSeconds).toBe(MAX_TICK_SECONDS);
  });

  it('should pass the same snowballs on when the tick is measured', () => {
    const plan = computeSnowballTickSeconds({
      snowballs: SNOWBALLS,
      level: LEVEL,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(plan.snowballs).toBe(SNOWBALLS);
  });

  it('should pass the same level on when the tick is measured', () => {
    const plan = computeSnowballTickSeconds({
      snowballs: SNOWBALLS,
      level: LEVEL,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(plan.level).toBe(LEVEL);
  });

  it('should give no snowballs when there are none in the air', () => {
    const plan = computeSnowballTickSeconds({
      snowballs: [],
      level: LEVEL,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(plan.snowballs).toEqual([]);
  });
});
