import {
  type Cannon,
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
import { isPlayerRightOfCannon } from './is-player-right-of-cannon';

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

const CANNON_LEFT = 10 * TILE_SIZE;
const CANNON_TOP = 2 * TILE_SIZE;
const PLAYER_TOP = 56;
const RIGHT_OF_CANNON_LEFT = 400;
const LEFT_OF_CANNON_LEFT = 200;
const ONE_PIXEL = 1;

const CANNON_CENTRE_LEFT = CANNON_LEFT + TILE_SIZE / 2;

const CANNON_CENTRE_PLAYER_LEFT = CANNON_CENTRE_LEFT - PLAYER_WIDTH / 2;

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const CANNON: Cannon = {
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: CANNON_LEFT, y: CANNON_TOP },
  timers: { reload: 0 },
  statuses: { isFacingRight: false },
};

describe('isPlayerRightOfCannon', () => {
  it('should say yes when the player stands to the right of the cannon', () => {
    const isRight = isPlayerRightOfCannon(
      CANNON,
      createPlayerAt(RIGHT_OF_CANNON_LEFT),
    );

    expect(isRight).toBe(true);
  });

  it('should say yes when the centre of the player is level with the centre of the cannon', () => {
    const isRight = isPlayerRightOfCannon(
      CANNON,
      createPlayerAt(CANNON_CENTRE_PLAYER_LEFT),
    );

    expect(isRight).toBe(true);
  });

  it('should say no when the centre of the player is just left of the centre of the cannon', () => {
    const isRight = isPlayerRightOfCannon(
      CANNON,
      createPlayerAt(CANNON_CENTRE_PLAYER_LEFT - ONE_PIXEL),
    );

    expect(isRight).toBe(false);
  });

  it('should say no when the player stands to the left of the cannon', () => {
    const isRight = isPlayerRightOfCannon(
      CANNON,
      createPlayerAt(LEFT_OF_CANNON_LEFT),
    );

    expect(isRight).toBe(false);
  });
});
