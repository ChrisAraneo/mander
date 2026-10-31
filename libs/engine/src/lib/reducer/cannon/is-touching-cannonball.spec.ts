import {
  type Cannonball,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import { CANNONBALL_SPEED } from './consts';
import { isTouchingCannonball } from './is-touching-cannonball';

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

const createCannonballAt = (left: number, top: number): Cannonball => ({
  position: { x: left, y: top },
  velocity: { x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED } },
});

describe('isTouchingCannonball', () => {
  it('should say yes when the cannonball flies into the player', () => {
    const cannonball = createCannonballAt(105, 120);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(true);
  });

  it('should say yes when the cannonball just reaches past the left edge of the player', () => {
    const cannonball = createCannonballAt(95, 120);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(true);
  });

  it('should say no when the cannonball is far from the player', () => {
    const cannonball = createCannonballAt(300, 300);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the left edge of the player', () => {
    const cannonball = createCannonballAt(94, 120);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the right edge of the player', () => {
    const cannonball = createCannonballAt(116, 120);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the top of the player', () => {
    const cannonball = createCannonballAt(105, 92);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the feet of the player', () => {
    const cannonball = createCannonballAt(105, 146);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });
});
