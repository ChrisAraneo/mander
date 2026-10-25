import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { computePlayerHorizontalMove } from './compute-player-horizontal-move';
import type { PlayerStepFall } from './types/player-step-fall';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '.....#', '######'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const createRunningPlayer = (positionX: number): Player => ({
  position: { x: positionX, y: 40 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const createFall = (positionX: number, velocityX: number): PlayerStepFall => ({
  level: LEVEL,
  player: createRunningPlayer(positionX),
  deltaSeconds: 0.04,
  velocityX,
  isFacingRight: true,
  velocityY: 75,
  isGrounded: true,
});

describe('computePlayerHorizontalMove', () => {
  it('should move the player the whole way when nothing is in the way', () => {
    const move = computePlayerHorizontalMove(createFall(40, 210));

    expect(move.position).toBeCloseTo(48.4, 6);
    expect(move.isBlocked).toBe(false);
  });

  it('should move the player to the left when the speed is below zero', () => {
    const move = computePlayerHorizontalMove(createFall(40, -210));

    expect(move.position).toBeCloseTo(31.6, 6);
    expect(move.isBlocked).toBe(false);
  });

  it('should stop the player flush against the wall when a solid tile is in the way', () => {
    const move = computePlayerHorizontalMove(createFall(130, 210));

    expect(move.position).toBe(138);
    expect(move.isBlocked).toBe(true);
  });

  it('should leave the player where they are when the speed is zero', () => {
    const move = computePlayerHorizontalMove(createFall(40, 0));

    expect(move.position).toBe(40);
    expect(move.isBlocked).toBe(false);
  });
});
