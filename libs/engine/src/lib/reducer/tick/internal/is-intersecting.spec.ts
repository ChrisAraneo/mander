import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createPlayer } from '../../player/create-player';
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
});

const LEVEL = createLevel(['.....', '.....', 's....', '#####']);

const RECTANGLE = { x: 100, y: 100, width: 20, height: 20 };

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  position: { x: left, y: top },
});

describe('isIntersecting', () => {
  it('should say yes when the player overlaps the rectangle', () => {
    const player = createPlayerAt(100, 100);

    const isTouching = isIntersecting(player, RECTANGLE, 0);

    expect(isTouching).toBe(true);
  });

  it('should say yes when the player is beside the rectangle and within the padding', () => {
    const player = createPlayerAt(70, 100);

    const isTouching = isIntersecting(player, RECTANGLE, 10);

    expect(isTouching).toBe(true);
  });

  it('should say no when the player is beside the rectangle and the padding only reaches its edge', () => {
    const player = createPlayerAt(70, 100);

    const isTouching = isIntersecting(player, RECTANGLE, 8);

    expect(isTouching).toBe(false);
  });

  it('should say no when the player is beside the rectangle and there is no padding', () => {
    const player = createPlayerAt(70, 100);

    const isTouching = isIntersecting(player, RECTANGLE, 0);

    expect(isTouching).toBe(false);
  });

  it('should say no when the player is far below the rectangle', () => {
    const player = createPlayerAt(100, 200);

    const isTouching = isIntersecting(player, RECTANGLE, 10);

    expect(isTouching).toBe(false);
  });
});
