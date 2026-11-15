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
import { isNearTile } from './is-near-tile';

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

const TILE = { x: 2, y: 2 };

const HEARTS = 3;

const ONE_PIXEL = 1;

const TILE_RECTANGLE = getEntityRectangle(TILE, GEM_ENTITY_BOX);

const ON_TILE_X = TILE_RECTANGLE.x + ONE_PIXEL;

const ON_TILE_Y = TILE_RECTANGLE.y - ONE_PIXEL;

const BESIDE_TILE_X = TILE_RECTANGLE.x + TILE_RECTANGLE.width + PICKUP_RANGE;

const FAR_FROM_TILE = 300;

const PADDING_PAST_THE_GAP = PICKUP_RANGE + ONE_PIXEL;

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: HEARTS } }),
  position: { x: left, y: top },
});

describe('isNearTile', () => {
  it('should say no when there is no tile', () => {
    const player = createPlayerAt(ON_TILE_X, ON_TILE_Y);

    const isNear = isNearTile(player, null, GEM_ENTITY_BOX, PICKUP_RANGE);

    expect(isNear).toBe(false);
  });

  it('should say yes when the player stands on the thing in the tile', () => {
    const player = createPlayerAt(ON_TILE_X, ON_TILE_Y);

    const isNear = isNearTile(player, TILE, GEM_ENTITY_BOX, PICKUP_RANGE);

    expect(isNear).toBe(true);
  });

  it('should say yes when the player is beside the thing in the tile and within the padding', () => {
    const player = createPlayerAt(BESIDE_TILE_X, ON_TILE_Y);

    const isNear = isNearTile(
      player,
      TILE,
      GEM_ENTITY_BOX,
      PADDING_PAST_THE_GAP,
    );

    expect(isNear).toBe(true);
  });

  it('should say no when the player is beside the thing in the tile and just beyond the padding', () => {
    const player = createPlayerAt(BESIDE_TILE_X, ON_TILE_Y);

    const isNear = isNearTile(player, TILE, GEM_ENTITY_BOX, PICKUP_RANGE);

    expect(isNear).toBe(false);
  });

  it('should say no when the player is far from the tile', () => {
    const player = createPlayerAt(FAR_FROM_TILE, FAR_FROM_TILE);

    const isNear = isNearTile(player, TILE, GEM_ENTITY_BOX, PICKUP_RANGE);

    expect(isNear).toBe(false);
  });
});
