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
import { isDroppingOntoHead } from './is-dropping-onto-head';

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

const BASE_ENEMY = createEnemies(LEVEL)[0];

const ENEMY: Enemy = {
  ...BASE_ENEMY,
  position: { x: 100, y: 74 },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: 0 },
  },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: 100, y: top },
});

describe('isDroppingOntoHead', () => {
  it('should say yes when the player falls from above the head down onto it', () => {
    const previousPlayer = createPlayerAt(30);
    const player = createPlayerAt(35);

    const isDropping = isDroppingOntoHead(previousPlayer, player, ENEMY, 0.02);

    expect(isDropping).toBe(true);
  });

  it('should say yes when the player was only just within the grace below the head', () => {
    const previousPlayer = createPlayerAt(40);
    const player = createPlayerAt(45);

    const isDropping = isDroppingOntoHead(previousPlayer, player, ENEMY, 0.02);

    expect(isDropping).toBe(true);
  });

  it('should say no when the player was already well below the head', () => {
    const previousPlayer = createPlayerAt(50);
    const player = createPlayerAt(55);

    const isDropping = isDroppingOntoHead(previousPlayer, player, ENEMY, 0.02);

    expect(isDropping).toBe(false);
  });

  it('should say no when the player has not yet come down to the head', () => {
    const previousPlayer = createPlayerAt(20);
    const player = createPlayerAt(25);

    const isDropping = isDroppingOntoHead(previousPlayer, player, ENEMY, 0.02);

    expect(isDropping).toBe(false);
  });
});
