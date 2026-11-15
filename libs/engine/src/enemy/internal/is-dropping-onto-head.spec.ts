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

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const ENEMY_LEFT = 100;
const ENEMY_HEAD_TOP = 74;
const FRAME_SECONDS = 0.02;
const ABOVE_HEAD_TOP = 30;
const ONTO_HEAD_TOP = 35;
const WITHIN_GRACE_TOP = 40;
const PAST_GRACE_TOP = 45;
const BELOW_HEAD_TOP = 50;
const FURTHER_BELOW_TOP = 55;
const HIGH_ABOVE_TOP = 20;
const STILL_ABOVE_TOP = 25;

const LEVEL = createLevel(['.....', '..e..', '#####']);

const BASE_ENEMY = createEnemies(LEVEL)[0];

const ENEMY: Enemy = {
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: ENEMY_HEAD_TOP },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: 0 },
  },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: ENEMY_LEFT, y: top },
});

describe('isDroppingOntoHead', () => {
  it('should say yes when the player falls from above the head down onto it', () => {
    const previousPlayer = createPlayerAt(ABOVE_HEAD_TOP);
    const player = createPlayerAt(ONTO_HEAD_TOP);

    const isDropping = isDroppingOntoHead(
      previousPlayer,
      player,
      ENEMY,
      FRAME_SECONDS,
    );

    expect(isDropping).toBe(true);
  });

  it('should say yes when the player was only just within the grace below the head', () => {
    const previousPlayer = createPlayerAt(WITHIN_GRACE_TOP);
    const player = createPlayerAt(PAST_GRACE_TOP);

    const isDropping = isDroppingOntoHead(
      previousPlayer,
      player,
      ENEMY,
      FRAME_SECONDS,
    );

    expect(isDropping).toBe(true);
  });

  it('should say no when the player was already well below the head', () => {
    const previousPlayer = createPlayerAt(BELOW_HEAD_TOP);
    const player = createPlayerAt(FURTHER_BELOW_TOP);

    const isDropping = isDroppingOntoHead(
      previousPlayer,
      player,
      ENEMY,
      FRAME_SECONDS,
    );

    expect(isDropping).toBe(false);
  });

  it('should say no when the player has not yet come down to the head', () => {
    const previousPlayer = createPlayerAt(HIGH_ABOVE_TOP);
    const player = createPlayerAt(STILL_ABOVE_TOP);

    const isDropping = isDroppingOntoHead(
      previousPlayer,
      player,
      ENEMY,
      FRAME_SECONDS,
    );

    expect(isDropping).toBe(false);
  });
});
