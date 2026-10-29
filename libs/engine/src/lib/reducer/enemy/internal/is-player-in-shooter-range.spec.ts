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
import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { ENEMY_HEIGHT, ENEMY_WIDTH, SHOOTER_RANGE } from '../consts';
import { isPlayerInShooterRange } from './is-player-in-shooter-range';

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

const SHOOTER_CENTRE = {
  x: 320 + ENEMY_WIDTH / 2,
  y: 64 + ENEMY_HEIGHT / 2,
};

const createPlayerCentredAt = (x: number, y: number): Player => ({
  ...BASE_PLAYER,
  position: { x: x - PLAYER_WIDTH / 2, y: y - PLAYER_HEIGHT / 2 },
});

describe('isPlayerInShooterRange', () => {
  it('should say yes when the player stands next to the shooter', () => {
    const isInRange = isPlayerInShooterRange(
      SHOOTER,
      createPlayerCentredAt(SHOOTER_CENTRE.x + 80, SHOOTER_CENTRE.y),
    );

    expect(isInRange).toBe(true);
  });

  it('should say yes when the centre of the player is exactly at the far end of the range to the side', () => {
    const isInRange = isPlayerInShooterRange(
      SHOOTER,
      createPlayerCentredAt(SHOOTER_CENTRE.x + SHOOTER_RANGE, SHOOTER_CENTRE.y),
    );

    expect(isInRange).toBe(true);
  });

  it('should say no when the centre of the player is just past the far end of the range to the side', () => {
    const isInRange = isPlayerInShooterRange(
      SHOOTER,
      createPlayerCentredAt(
        SHOOTER_CENTRE.x + SHOOTER_RANGE + 1,
        SHOOTER_CENTRE.y,
      ),
    );

    expect(isInRange).toBe(false);
  });

  it('should say no when the player stands further than the range below', () => {
    const isInRange = isPlayerInShooterRange(
      SHOOTER,
      createPlayerCentredAt(
        SHOOTER_CENTRE.x,
        SHOOTER_CENTRE.y + SHOOTER_RANGE + 1,
      ),
    );

    expect(isInRange).toBe(false);
  });

  it('should say no when the player stands a whole range away on both axes at once', () => {
    const isInRange = isPlayerInShooterRange(
      SHOOTER,
      createPlayerCentredAt(
        SHOOTER_CENTRE.x + SHOOTER_RANGE,
        SHOOTER_CENTRE.y + SHOOTER_RANGE,
      ),
    );

    expect(isInRange).toBe(false);
  });

  it('should say yes when the player stands behind the shooter within the range', () => {
    const isInRange = isPlayerInShooterRange(
      SHOOTER,
      createPlayerCentredAt(SHOOTER_CENTRE.x - SHOOTER_RANGE, SHOOTER_CENTRE.y),
    );

    expect(isInRange).toBe(true);
  });
});
