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

import { BASE_HEARTS, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { ENEMY_WIDTH } from '../consts';
import { isPlayerRightOfShooter } from './is-player-right-of-shooter';

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

const SHOOTER: Enemy = {
  kind: 'SHOOTER',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
};

const SHOOTER_CENTRE_X = ENEMY_LEFT + ENEMY_WIDTH / 2;

describe('isPlayerRightOfShooter', () => {
  it('should say yes when the player stands to the right of the shooter', () => {
    const isRight = isPlayerRightOfShooter(SHOOTER, createPlayerAt(600));

    expect(isRight).toBe(true);
  });

  it('should say no when the player stands to the left of the shooter', () => {
    const isRight = isPlayerRightOfShooter(SHOOTER, createPlayerAt(100));

    expect(isRight).toBe(false);
  });

  it('should say yes when the centres line up exactly', () => {
    const isRight = isPlayerRightOfShooter(
      SHOOTER,
      createPlayerAt(SHOOTER_CENTRE_X - PLAYER_WIDTH / 2),
    );

    expect(isRight).toBe(true);
  });

  it('should ignore the facing of the shooter when it reads the player side', () => {
    const facingLeft = {
      ...SHOOTER,
      statuses: { ...SHOOTER.statuses, isFacingRight: false },
    };

    const isRight = isPlayerRightOfShooter(facingLeft, createPlayerAt(600));

    expect(isRight).toBe(true);
  });
});
