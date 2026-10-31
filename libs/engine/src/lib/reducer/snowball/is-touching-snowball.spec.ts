import {
  type Player,
  type Snowball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import { SNOWBALL_SPEED } from './consts';
import { isTouchingSnowball } from './is-touching-snowball';

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

const LEVEL = createLevel(['.....', '.....', '#####']);

const PLAYER: Player = {
  ...createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } }),
  position: { x: 100, y: 100 },
};

const createSnowballAt = (left: number, top: number): Snowball => ({
  position: { x: left, y: top },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

describe('isTouchingSnowball', () => {
  it('should say yes when the snowball flies into the player', () => {
    const isTouching = isTouchingSnowball(PLAYER, createSnowballAt(105, 120));

    expect(isTouching).toBe(true);
  });

  it('should say yes when the snowball just reaches past the left edge of the player', () => {
    const isTouching = isTouchingSnowball(PLAYER, createSnowballAt(95, 120));

    expect(isTouching).toBe(true);
  });

  it('should say no when the snowball is far from the player', () => {
    const isTouching = isTouchingSnowball(PLAYER, createSnowballAt(300, 300));

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the left edge of the player', () => {
    const isTouching = isTouchingSnowball(PLAYER, createSnowballAt(94, 120));

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the right edge of the player', () => {
    const isTouching = isTouchingSnowball(PLAYER, createSnowballAt(116, 120));

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the top of the player', () => {
    const isTouching = isTouchingSnowball(PLAYER, createSnowballAt(105, 92));

    expect(isTouching).toBe(false);
  });

  it('should say no when the snowball only meets the feet of the player', () => {
    const isTouching = isTouchingSnowball(PLAYER, createSnowballAt(105, 146));

    expect(isTouching).toBe(false);
  });
});
