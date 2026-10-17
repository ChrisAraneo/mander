import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { createEnemies } from '../create-enemies';
import { isOverlappingHorizontally } from './is-overlapping-horizontally';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const ENEMY: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: 100, y: 74 },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 30 },
});

describe('isOverlappingHorizontally', () => {
  it('should say yes when the player is right above the enemy', () => {
    const player = createPlayerAt(100);

    const isOverlapping = isOverlappingHorizontally(player, ENEMY);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the player is just past the right side of the enemy but within the grace', () => {
    const player = createPlayerAt(116);

    const isOverlapping = isOverlappingHorizontally(player, ENEMY);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the player is just past the left side of the enemy but within the grace', () => {
    const player = createPlayerAt(83);

    const isOverlapping = isOverlappingHorizontally(player, ENEMY);

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the player is beyond the grace on the right of the enemy', () => {
    const player = createPlayerAt(119);

    const isOverlapping = isOverlappingHorizontally(player, ENEMY);

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the player is beyond the grace on the left of the enemy', () => {
    const player = createPlayerAt(81);

    const isOverlapping = isOverlappingHorizontally(player, ENEMY);

    expect(isOverlapping).toBe(false);
  });
});
