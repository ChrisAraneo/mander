import {
  GEM_ENTITY_BOX,
  getEntityRectangle,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { PICKUP_RANGE } from '../consts';
import { filterLeftBehind } from './filter-left-behind';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

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

const LEVEL = createLevel([
  '............',
  '............',
  's...........',
  '############',
]);

const HEARTS = 3;

const ONE_PIXEL = 1;

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: HEARTS } }),
  position: { x: left, y: top },
});

const NEAR_GEM = { x: 2, y: 2 };

const FAR_GEM = { x: 10, y: 2 };

const NEAR_GEM_RECTANGLE = getEntityRectangle(NEAR_GEM, GEM_ENTITY_BOX);

const ON_GEM_X = NEAR_GEM_RECTANGLE.x + ONE_PIXEL;

const ON_GEM_Y = NEAR_GEM_RECTANGLE.y - ONE_PIXEL;

const JUST_BEYOND_RANGE_X =
  NEAR_GEM_RECTANGLE.x + NEAR_GEM_RECTANGLE.width + PICKUP_RANGE;

const JUST_INSIDE_RANGE_X = JUST_BEYOND_RANGE_X - ONE_PIXEL;

describe('filterLeftBehind', () => {
  it('should keep only the gems the player is not near when the player stands on one of them', () => {
    const player = createPlayerAt(ON_GEM_X, ON_GEM_Y);

    const gems = filterLeftBehind(player, [NEAR_GEM, FAR_GEM]);

    expect(gems).toEqual([FAR_GEM]);
  });

  it('should keep the gem when the player is just beyond the pickup range', () => {
    const player = createPlayerAt(JUST_BEYOND_RANGE_X, ON_GEM_Y);

    const gems = filterLeftBehind(player, [NEAR_GEM]);

    expect(gems).toEqual([NEAR_GEM]);
  });

  it('should drop the gem when the player is just inside the pickup range', () => {
    const player = createPlayerAt(JUST_INSIDE_RANGE_X, ON_GEM_Y);

    const gems = filterLeftBehind(player, [NEAR_GEM]);

    expect(gems).toEqual([]);
  });

  it('should give no gems when there are no gems', () => {
    const player = createPlayerAt(ON_GEM_X, ON_GEM_Y);

    const gems = filterLeftBehind(player, []);

    expect(gems).toEqual([]);
  });
});
