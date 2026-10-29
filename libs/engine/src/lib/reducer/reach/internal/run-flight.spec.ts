import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createStandingPlayer } from './create-standing-player';
import { runFlight } from './run-flight';
import type { MovePlan } from './types/move-plan';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const createAirbornePlayer = (left: number, top: number): Player => ({
  ...createStandingPlayer(left, top),
  statuses: { ...createStandingPlayer(left, top).statuses, isGrounded: false },
});

const FLOORED_LEVEL = createLevel(['.....', '.....', '#####']);

const BOTTOMLESS_LEVEL = createLevel(['.....', '.....']);

const STILL_PLAN: MovePlan = { direction: 0, jumpFrames: 0 };

describe('runFlight', () => {
  it('should end with the landing state when the player drops onto the ground', () => {
    const player = createAirbornePlayer(40, 14);

    const states = runFlight(
      { level: FLOORED_LEVEL, plan: STILL_PLAN },
      player,
      0,
      [],
    );

    expect(states).toEqual([createStandingPlayer(40, 16)]);
  });

  it('should give the states before the fall when the player drops out of the bottom of the level', () => {
    const player = createAirbornePlayer(40, 56);

    const states = runFlight(
      { level: BOTTOMLESS_LEVEL, plan: STILL_PLAN },
      player,
      0,
      [],
    );

    expect(size(states)).toBe(1);
    expect(states[0].position.y).toBeCloseTo(58.88, 6);
    expect(states[0].statuses.isGrounded).toBe(false);
  });

  it('should give back the states it was given when the player falls out of the level on the first frame', () => {
    const player = createAirbornePlayer(40, 64);
    const earlier = [createAirbornePlayer(40, 60)];

    const states = runFlight(
      { level: BOTTOMLESS_LEVEL, plan: STILL_PLAN },
      player,
      0,
      earlier,
    );

    expect(states).toBe(earlier);
  });
});
