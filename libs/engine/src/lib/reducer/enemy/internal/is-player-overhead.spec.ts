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
import { isPlayerOverhead } from './is-player-overhead';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const ENEMY: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: 100, y: 74 },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number, top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: top },
});

const createDyingPlayerAt = (left: number, top: number): Player => ({
  ...createPlayerAt(left, top),
  timers: { ...BASE_PLAYER.timers, death: 0.1 },
});

describe('isPlayerOverhead', () => {
  it('should say yes when a living player is close by and above the enemy', () => {
    const player = createPlayerAt(100, 20);

    const isOverhead = isPlayerOverhead(ENEMY, player);

    expect(isOverhead).toBe(true);
  });

  it('should say no when the player above the enemy is dying', () => {
    const player = createDyingPlayerAt(100, 20);

    const isOverhead = isPlayerOverhead(ENEMY, player);

    expect(isOverhead).toBe(false);
  });

  it('should say no when the player is high up but far away from the enemy', () => {
    const player = createPlayerAt(300, 20);

    const isOverhead = isPlayerOverhead(ENEMY, player);

    expect(isOverhead).toBe(false);
  });

  it('should say no when the player is close by but not above the enemy', () => {
    const player = createPlayerAt(100, 74);

    const isOverhead = isPlayerOverhead(ENEMY, player);

    expect(isOverhead).toBe(false);
  });
});
