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
import { computePlayerStepHorizontalMove } from './compute-player-step-horizontal-move';
import type { PlayerStepFall } from './types/player-step-fall';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '.....#', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createRunningPlayer = (positionX: number): Player => ({
  position: { x: positionX, y: 40 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const LEVEL = createLevel();

const OPEN_PLAYER = createRunningPlayer(40);

const WALLED_PLAYER = createRunningPlayer(130);

const createFallStep = (player: Player): PlayerStepFall => ({
  level: LEVEL,
  player,
  deltaSeconds: 0.04,
  velocityX: 210,
  isFacingRight: true,
  velocityY: 75,
  isGrounded: true,
});

const OPEN_STEP = createFallStep(OPEN_PLAYER);

describe('computePlayerStepHorizontalMove', () => {
  it('should move the player the whole way and keep their speed when nothing is in the way', () => {
    const step = computePlayerStepHorizontalMove(OPEN_STEP);

    expect(step.nextX).toBeCloseTo(40 + 210 * 0.04, 6);
    expect(step.nextX).toBeCloseTo(48.4, 6);
    expect(step.blockedVelocityX).toBe(210);
  });

  it('should stop the player flush against the wall and take away their speed when a solid tile is in the way', () => {
    const step = computePlayerStepHorizontalMove(createFallStep(WALLED_PLAYER));

    expect(step.nextX).toBe(138);
    expect(step.blockedVelocityX).toBe(0);
  });

  it('should pass the level on unchanged when it moves the player sideways', () => {
    const step = computePlayerStepHorizontalMove(OPEN_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the player on unchanged when it moves the player sideways', () => {
    const step = computePlayerStepHorizontalMove(OPEN_STEP);

    expect(step.player).toBe(OPEN_PLAYER);
  });

  it('should pass the tick length on unchanged when it moves the player sideways', () => {
    const step = computePlayerStepHorizontalMove(OPEN_STEP);

    expect(step.deltaSeconds).toBe(0.04);
  });

  it('should pass the facing on unchanged when it moves the player sideways', () => {
    const step = computePlayerStepHorizontalMove(OPEN_STEP);

    expect(step.isFacingRight).toBe(true);
  });

  it('should pass the vertical velocity on unchanged when it moves the player sideways', () => {
    const step = computePlayerStepHorizontalMove(OPEN_STEP);

    expect(step.velocityY).toBe(75);
  });

  it('should pass the grounded status on unchanged when it moves the player sideways', () => {
    const step = computePlayerStepHorizontalMove(OPEN_STEP);

    expect(step.isGrounded).toBe(true);
  });
});
