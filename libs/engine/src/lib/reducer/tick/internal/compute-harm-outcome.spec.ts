import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import {
  HURT_FLASH_SECONDS,
  HURT_INVINCIBLE_SECONDS,
  PLAYER_DEATH_LAUNCH_VELOCITY,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from '../../player/consts';
import { computeHarmOutcome } from './compute-harm-outcome';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel([
  '........',
  '........',
  '........',
  's.......',
  '........',
  '########',
]);

const STATE: GameState = {
  ...createInitialState(LEVEL, 0, []),
  deaths: 2,
};

const createPlayerAt = (top: number, hearts: number): Player => ({
  ...STATE.player,
  position: { x: 5, y: top },
  hearts: { value: hearts },
});

const createDyingPlayerAt = (top: number, hearts: number): Player => ({
  position: { x: 5, y: top },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: {
      current: -PLAYER_DEATH_LAUNCH_VELOCITY,
      max: PLAYER_MAX_JUMP_VELOCITY,
    },
  },
  hearts: { value: hearts },
  timers: { death: 0, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
});

describe('computeHarmOutcome', () => {
  it('should keep the game going with the player dying one heart down when the player falls into the pit with hearts to spare', () => {
    const player = createPlayerAt(300, 3);

    const outcome = computeHarmOutcome(STATE, player, [], [], [], false);

    expect(outcome).toEqual({
      player: createDyingPlayerAt(300, 2),
      deaths: 3,
      status: 'PLAYING',
    });
  });

  it('should end the game when the player falls into the pit with one heart left', () => {
    const player = createPlayerAt(300, 1);

    const outcome = computeHarmOutcome(STATE, player, [], [], [], false);

    expect(outcome).toEqual({
      player: createDyingPlayerAt(300, 0),
      deaths: 3,
      status: 'GAME_OVER',
    });
  });

  it('should hurt the player and make the player briefly invincible when a hazard strikes the player with hearts to spare', () => {
    const player = createPlayerAt(48, 3);

    const outcome = computeHarmOutcome(STATE, player, [], [], [], true);

    expect(outcome).toEqual({
      player: {
        ...player,
        hearts: { value: 2 },
        timers: {
          death: null,
          invincibility: HURT_INVINCIBLE_SECONDS,
          star: 0,
          hurt: HURT_FLASH_SECONDS,
        },
      },
      deaths: 2,
      status: 'PLAYING',
    });
  });

  it('should end the game when a hazard strikes the player with one heart left', () => {
    const player = createPlayerAt(48, 1);

    const outcome = computeHarmOutcome(STATE, player, [], [], [], true);

    expect(outcome).toEqual({
      player: createDyingPlayerAt(48, 0),
      deaths: 3,
      status: 'GAME_OVER',
    });
  });

  it('should leave the player alone and keep the game going when nothing harms the player', () => {
    const player = createPlayerAt(48, 3);

    const outcome = computeHarmOutcome(STATE, player, [], [], [], false);

    expect(outcome.player).toBe(player);
    expect(outcome.deaths).toBe(2);
    expect(outcome.status).toBe('PLAYING');
  });
});
