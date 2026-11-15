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

import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { ENEMY_HEIGHT, ENEMY_WIDTH, FREEZING_RANGE } from '../consts';
import { isPlayerInFreezingRange } from './is-player-in-freezing-range';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;

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

const FREEZER_CENTRE = {
  x: ENEMY_LEFT + ENEMY_WIDTH / 2,
  y: ENEMY_TOP + ENEMY_HEIGHT / 2,
};

const createPlayerCentredAt = (x: number, y: number): Player => ({
  ...BASE_PLAYER,
  position: { x: x - PLAYER_WIDTH / 2, y: y - PLAYER_HEIGHT / 2 },
});

describe('isPlayerInFreezingRange', () => {
  it('should say yes when the player stands next to the freezing enemy', () => {
    const isInRange = isPlayerInFreezingRange(
      FREEZER,
      createPlayerCentredAt(FREEZER_CENTRE.x + 80, FREEZER_CENTRE.y),
    );

    expect(isInRange).toBe(true);
  });

  it('should say yes when the centre of the player is exactly at the far end of the range to the side', () => {
    const isInRange = isPlayerInFreezingRange(
      FREEZER,
      createPlayerCentredAt(
        FREEZER_CENTRE.x + FREEZING_RANGE,
        FREEZER_CENTRE.y,
      ),
    );

    expect(isInRange).toBe(true);
  });

  it('should say no when the centre of the player is just past the far end of the range to the side', () => {
    const isInRange = isPlayerInFreezingRange(
      FREEZER,
      createPlayerCentredAt(
        FREEZER_CENTRE.x + FREEZING_RANGE + 1,
        FREEZER_CENTRE.y,
      ),
    );

    expect(isInRange).toBe(false);
  });

  it('should say no when the player stands further than the range below', () => {
    const isInRange = isPlayerInFreezingRange(
      FREEZER,
      createPlayerCentredAt(
        FREEZER_CENTRE.x,
        FREEZER_CENTRE.y + FREEZING_RANGE + 1,
      ),
    );

    expect(isInRange).toBe(false);
  });

  it('should say yes when the player stands behind the freezing enemy within the range', () => {
    const isInRange = isPlayerInFreezingRange(
      FREEZER,
      createPlayerCentredAt(
        FREEZER_CENTRE.x - FREEZING_RANGE,
        FREEZER_CENTRE.y,
      ),
    );

    expect(isInRange).toBe(true);
  });
});
