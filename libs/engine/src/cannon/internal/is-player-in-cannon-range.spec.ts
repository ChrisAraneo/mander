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

import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { CANNON_RANGE } from '../consts';
import { isPlayerInCannonRange } from './is-player-in-cannon-range';

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
const ONE_PIXEL = 1;
const NEAR_LEFT = 400;
const PLAYER_TOP = 56;

const CANNON_CENTRE_LEFT = CANNON_LEFT + TILE_SIZE / 2;
const CANNON_CENTRE_TOP = CANNON_TOP + TILE_SIZE / 2;

const RANGE_EDGE_LEFT = CANNON_CENTRE_LEFT + CANNON_RANGE - PLAYER_WIDTH / 2;
const RANGE_EDGE_TOP = CANNON_CENTRE_TOP + CANNON_RANGE - PLAYER_HEIGHT / 2;
const UNDER_CANNON_LEFT = CANNON_CENTRE_LEFT - PLAYER_WIDTH / 2;

const createPlayerAt = (left: number, top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: top },
});

const CANNON: Cannon = {
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: CANNON_LEFT, y: CANNON_TOP },
  timers: { reload: 0 },
  statuses: { isFacingRight: true },
};

describe('isPlayerInCannonRange', () => {
  it('should say yes when the player stands near the cannon', () => {
    const isInRange = isPlayerInCannonRange(
      CANNON,
      createPlayerAt(NEAR_LEFT, PLAYER_TOP),
    );

    expect(isInRange).toBe(true);
  });

  it('should say yes when the centre of the player is exactly at the far end of the range to the side', () => {
    const isInRange = isPlayerInCannonRange(
      CANNON,
      createPlayerAt(RANGE_EDGE_LEFT, PLAYER_TOP),
    );

    expect(isInRange).toBe(true);
  });

  it('should say no when the centre of the player is just beyond the range to the side', () => {
    const isInRange = isPlayerInCannonRange(
      CANNON,
      createPlayerAt(RANGE_EDGE_LEFT + ONE_PIXEL, PLAYER_TOP),
    );

    expect(isInRange).toBe(false);
  });

  it('should say yes when the centre of the player is exactly at the far end of the range below', () => {
    const isInRange = isPlayerInCannonRange(
      CANNON,
      createPlayerAt(UNDER_CANNON_LEFT, RANGE_EDGE_TOP),
    );

    expect(isInRange).toBe(true);
  });

  it('should say no when the centre of the player is just beyond the range below', () => {
    const isInRange = isPlayerInCannonRange(
      CANNON,
      createPlayerAt(UNDER_CANNON_LEFT, RANGE_EDGE_TOP + ONE_PIXEL),
    );

    expect(isInRange).toBe(false);
  });
});
