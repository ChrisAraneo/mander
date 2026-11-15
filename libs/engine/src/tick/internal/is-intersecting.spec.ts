import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { isIntersecting } from './is-intersecting';

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

const LEVEL = createLevel(['.....', '.....', 's....', '#####']);

const HEARTS = 3;

const ONE_PIXEL = 1;

const RECTANGLE_X = 100;

const RECTANGLE_Y = 100;

const RECTANGLE_SIZE = 20;

const RECTANGLE = {
  x: RECTANGLE_X,
  y: RECTANGLE_Y,
  width: RECTANGLE_SIZE,
  height: RECTANGLE_SIZE,
};

const GAP = 8;

const BESIDE_X = RECTANGLE_X - PLAYER_WIDTH - GAP;

const FAR_BELOW_Y = RECTANGLE_Y + RECTANGLE_SIZE + PLAYER_HEIGHT * 2;

const NO_PADDING = 0;

const PADDING_PAST_THE_GAP = GAP + ONE_PIXEL;

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: HEARTS } }),
  position: { x: left, y: top },
});

describe('isIntersecting', () => {
  it('should say yes when the player overlaps the rectangle', () => {
    const player = createPlayerAt(RECTANGLE_X, RECTANGLE_Y);

    const isTouching = isIntersecting(player, RECTANGLE, NO_PADDING);

    expect(isTouching).toBe(true);
  });

  it('should say yes when the player is beside the rectangle and within the padding', () => {
    const player = createPlayerAt(BESIDE_X, RECTANGLE_Y);

    const isTouching = isIntersecting(player, RECTANGLE, PADDING_PAST_THE_GAP);

    expect(isTouching).toBe(true);
  });

  it('should say no when the player is beside the rectangle and the padding only reaches its edge', () => {
    const player = createPlayerAt(BESIDE_X, RECTANGLE_Y);

    const isTouching = isIntersecting(player, RECTANGLE, GAP);

    expect(isTouching).toBe(false);
  });

  it('should say no when the player is beside the rectangle and there is no padding', () => {
    const player = createPlayerAt(BESIDE_X, RECTANGLE_Y);

    const isTouching = isIntersecting(player, RECTANGLE, NO_PADDING);

    expect(isTouching).toBe(false);
  });

  it('should say no when the player is far below the rectangle', () => {
    const player = createPlayerAt(RECTANGLE_X, FAR_BELOW_Y);

    const isTouching = isIntersecting(player, RECTANGLE, PADDING_PAST_THE_GAP);

    expect(isTouching).toBe(false);
  });
});
