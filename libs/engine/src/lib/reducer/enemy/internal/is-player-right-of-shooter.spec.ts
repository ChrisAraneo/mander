import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { ENEMY_WIDTH } from '../consts';
import { isPlayerRightOfShooter } from './is-player-right-of-shooter';

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
  position: { x: left, y: 56 },
});

const SHOOTER: Enemy = {
  kind: 'SHOOTER',
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
};

const SHOOTER_CENTRE_X = 320 + ENEMY_WIDTH / 2;

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
