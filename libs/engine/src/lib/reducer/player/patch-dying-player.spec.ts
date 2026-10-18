import {
  type Player,
  type Tile,
  TERMINAL_VELOCITY,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from './consts';
import { createPlayer } from './create-player';
import { getSpawnPosition } from './get-spawn-position';
import { patchDyingPlayer } from './patch-dying-player';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = ['.....', '.....', '.....', '..S..', '#####'];

const LEVEL: GameLevel = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
};

const createDyingPlayer = (velocityY: number, death: number): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: velocityY, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: 2 },
  timers: { death, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
});

describe('patchDyingPlayer', () => {
  it('should let the player fall and count the time spent dying when the death is not over', () => {
    const player = createDyingPlayer(100, 0.25);

    const patched = patchDyingPlayer(LEVEL, player, 0.25, 0.03125);

    expect(patched).toEqual({
      position: { x: 100, y: 203.125 },
      velocity: {
        x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
        y: { current: 156.25, max: PLAYER_MAX_JUMP_VELOCITY },
      },
      hearts: { value: 2 },
      timers: { death: 0.28125, invincibility: 0, star: 0, hurt: 0 },
      statuses: {
        isFacingRight: true,
        isGrounded: false,
        isJumpQueued: false,
      },
    });
  });

  it('should keep the fall at terminal velocity when the player is already falling very fast', () => {
    const player = createDyingPlayer(1140, 0.25);

    const patched = patchDyingPlayer(LEVEL, player, 0.25, 0.03125);

    expect(patched.velocity.y.current).toBe(TERMINAL_VELOCITY);
    expect(patched.position.y).toBe(235.625);
  });

  it('should bring the player back alive at the spawn when the death is over', () => {
    const player = createDyingPlayer(100, 0.71875);

    const patched = patchDyingPlayer(LEVEL, player, 0.71875, 0.03125);

    expect(patched).toEqual(createPlayer(LEVEL, player));
    expect(patched.position).toEqual(getSpawnPosition(LEVEL));
    expect(patched.hearts).toEqual({ value: 2 });
    expect(patched.timers.death).toBeNull();
  });

  it('should advance by no more than one longest tick when a lot of time has passed', () => {
    const player = createDyingPlayer(100, 0.25);

    const patched = patchDyingPlayer(LEVEL, player, 0.25, 1);

    expect(patched.position.y).toBeCloseTo(204, 6);
    expect(patched.velocity.y.current).toBeCloseTo(172, 6);
    expect(patched.timers.death).toBeCloseTo(0.29, 6);
  });

  it('should leave the given player unchanged when the player keeps dying', () => {
    const player = createDyingPlayer(100, 0.25);

    patchDyingPlayer(LEVEL, player, 0.25, 0.03125);

    expect(player).toEqual(createDyingPlayer(100, 0.25));
  });
});
