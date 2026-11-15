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
import { SNOWBALL_SIZE, SNOWBALL_SPEED } from '../consts';
import { filterSnowballsInLevel } from './filter-snowballs-in-level';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['..........', '..........', '##########'];

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

const LEVEL = createLevel(ROWS);

const LEVEL_RIGHT_EDGE = size(head(ROWS)) * TILE_SIZE;

const INSIDE_X = 50;

const A_STEP_BEYOND_THE_EDGE = 1;

const PAST_THE_LEFT_EDGE_X = -SNOWBALL_SIZE - A_STEP_BEYOND_THE_EDGE;

const PAST_THE_RIGHT_EDGE_X = LEVEL_RIGHT_EDGE + A_STEP_BEYOND_THE_EDGE;

const createSnowball = (left: number): Snowball => ({
  position: { x: left, y: TILE_SIZE },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

describe('filterSnowballsInLevel', () => {
  it('should keep a snowball when it is still inside the level', () => {
    const snowballs = filterSnowballsInLevel({
      snowballs: [createSnowball(INSIDE_X)],
      level: LEVEL,
    });

    expect(snowballs).toEqual([createSnowball(INSIDE_X)]);
  });

  it('should drop a snowball when it has flown out past the left of the level', () => {
    const snowballs = filterSnowballsInLevel({
      snowballs: [
        createSnowball(PAST_THE_LEFT_EDGE_X),
        createSnowball(INSIDE_X),
      ],
      level: LEVEL,
    });

    expect(snowballs).toEqual([createSnowball(INSIDE_X)]);
  });

  it('should drop a snowball when it has flown out past the right of the level', () => {
    const snowballs = filterSnowballsInLevel({
      snowballs: [
        createSnowball(PAST_THE_RIGHT_EDGE_X),
        createSnowball(INSIDE_X),
      ],
      level: LEVEL,
    });

    expect(snowballs).toEqual([createSnowball(INSIDE_X)]);
  });

  it('should give no snowballs when there are none in the air', () => {
    expect(filterSnowballsInLevel({ snowballs: [], level: LEVEL })).toEqual([]);
  });

  it('should leave the given snowballs alone when they are sifted', () => {
    const snowballs = [createSnowball(INSIDE_X)];

    filterSnowballsInLevel({ snowballs, level: LEVEL });

    expect(snowballs).toEqual([createSnowball(INSIDE_X)]);
  });
});
