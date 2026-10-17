import {
  type Fireball,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createPlayer } from '../player/create-player';
import { isTouchingFireball } from './is-touching-fireball';

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
});

const LEVEL = createLevel(['.....', '.....', 's....', '#####']);

const FIREBALL: Fireball = {
  spin: 'CLOCKWISE',
  origin: { x: 0, y: 100 },
  angle: 0,
};

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  position: { x: left, y: top },
});

describe('isTouchingFireball', () => {
  it('should say yes when the player stands in the fireball', () => {
    const player = createPlayerAt(149, 60);

    const isTouching = isTouchingFireball(player, FIREBALL);

    expect(isTouching).toBe(true);
  });

  it('should say yes when the side of the player reaches just into the fireball', () => {
    const player = createPlayerAt(138, 60);

    const isTouching = isTouchingFireball(player, FIREBALL);

    expect(isTouching).toBe(true);
  });

  it('should say no when the player stands far from the fireball', () => {
    const player = createPlayerAt(300, 60);

    const isTouching = isTouchingFireball(player, FIREBALL);

    expect(isTouching).toBe(false);
  });

  it('should say no when the side of the player only touches the fireball', () => {
    const player = createPlayerAt(137, 60);

    const isTouching = isTouchingFireball(player, FIREBALL);

    expect(isTouching).toBe(false);
  });

  it('should say no when the feet of the player only touch the top of the fireball', () => {
    const player = createPlayerAt(149, 47);

    const isTouching = isTouchingFireball(player, FIREBALL);

    expect(isTouching).toBe(false);
  });

  it('should say no when the head of the player only touches the bottom of the fireball', () => {
    const player = createPlayerAt(149, 103);

    const isTouching = isTouchingFireball(player, FIREBALL);

    expect(isTouching).toBe(false);
  });
});
