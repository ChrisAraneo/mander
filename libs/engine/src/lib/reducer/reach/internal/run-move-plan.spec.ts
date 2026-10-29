import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createStandingPlayer } from './create-standing-player';
import { runFlight } from './run-flight';
import { runMovePlan } from './run-move-plan';
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

const LEVEL = createLevel(['.....', '.....', '#####']);

const STILL_PLAN: MovePlan = { direction: 0, jumpFrames: 0 };

const RIGHT_JUMP_PLAN: MovePlan = { direction: 1, jumpFrames: 3 };

describe('runMovePlan', () => {
  it('should fly the plan from the first frame with no earlier states when the player starts on the ground', () => {
    const player = createStandingPlayer(40, 16);

    const states = runMovePlan(LEVEL, RIGHT_JUMP_PLAN, player);

    expect(states).toEqual(
      runFlight({ level: LEVEL, plan: RIGHT_JUMP_PLAN }, player, 0, []),
    );
  });

  it('should give only the landing state when the player drops onto the ground on the first frame', () => {
    const player = createAirbornePlayer(40, 14);

    const states = runMovePlan(LEVEL, STILL_PLAN, player);

    expect(states).toEqual([createStandingPlayer(40, 16)]);
  });
});
