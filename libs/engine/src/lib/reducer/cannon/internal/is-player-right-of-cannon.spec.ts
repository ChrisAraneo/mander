import {
  type Cannon,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { isPlayerRightOfCannon } from './is-player-right-of-cannon';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 56 },
});

const CANNON: Cannon = {
  position: { x: 320, y: 64 },
  timers: { reload: 0 },
  statuses: { isFacingRight: false },
};

describe('isPlayerRightOfCannon', () => {
  it('should say yes when the player stands to the right of the cannon', () => {
    const isRight = isPlayerRightOfCannon(CANNON, createPlayerAt(400));

    expect(isRight).toBe(true);
  });

  it('should say yes when the centre of the player is level with the centre of the cannon', () => {
    const isRight = isPlayerRightOfCannon(CANNON, createPlayerAt(325));

    expect(isRight).toBe(true);
  });

  it('should say no when the centre of the player is just left of the centre of the cannon', () => {
    const isRight = isPlayerRightOfCannon(CANNON, createPlayerAt(324));

    expect(isRight).toBe(false);
  });

  it('should say no when the player stands to the left of the cannon', () => {
    const isRight = isPlayerRightOfCannon(CANNON, createPlayerAt(200));

    expect(isRight).toBe(false);
  });
});
