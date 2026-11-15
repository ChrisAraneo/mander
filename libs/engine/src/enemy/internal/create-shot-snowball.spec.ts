import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { SNOWBALL_SIZE, SNOWBALL_SPEED } from '../../snowball/consts';
import type { GameLevel } from '../../state/types/game-level';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { createShotSnowball } from './create-shot-snowball';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_TOP = 56;

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

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const FREEZER: Enemy = {
  kind: 'FREEZING',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
};

describe('createShotSnowball', () => {
  it('should put the snowball in the middle of the freezing enemy when it is thrown', () => {
    const snowball = createShotSnowball(FREEZER, createPlayerAt(600));

    expect(snowball.position).toEqual({
      x: ENEMY_LEFT + (ENEMY_WIDTH - SNOWBALL_SIZE) / 2,
      y: ENEMY_TOP + (ENEMY_HEIGHT - SNOWBALL_SIZE) / 2,
    });
  });

  it('should send the snowball right at snowball speed when the player stands to the right', () => {
    const snowball = createShotSnowball(FREEZER, createPlayerAt(600));

    expect(snowball.velocity.x).toEqual({
      current: SNOWBALL_SPEED,
      max: SNOWBALL_SPEED,
    });
  });

  it('should send the snowball left at snowball speed when the player stands to the left', () => {
    const snowball = createShotSnowball(FREEZER, createPlayerAt(100));

    expect(snowball.velocity.x).toEqual({
      current: -SNOWBALL_SPEED,
      max: SNOWBALL_SPEED,
    });
  });

  it('should aim at the player rather than where the enemy walks when the two disagree', () => {
    const facingRight = createShotSnowball(FREEZER, createPlayerAt(100));
    const facingLeft = createShotSnowball(
      { ...FREEZER, statuses: { ...FREEZER.statuses, isFacingRight: false } },
      createPlayerAt(100),
    );

    expect(facingRight).toEqual(facingLeft);
  });
});
