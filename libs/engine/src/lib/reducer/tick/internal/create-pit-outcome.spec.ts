import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import {
  PLAYER_DEATH_LAUNCH_VELOCITY,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from '../../player/consts';
import { createPitOutcome } from './create-pit-outcome';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel([
  '........',
  '........',
  '........',
  's.......',
  '........',
  '########',
]);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  deaths: 1,
});

describe('createPitOutcome', () => {
  it('should keep the game going with the player dying one heart down when the player falls into the pit', () => {
    const state = createState();
    const player = { ...state.player, hearts: { value: 3 } };

    const outcome = createPitOutcome(state, player);

    expect(outcome).toEqual({
      player: {
        position: { x: 5, y: 48 },
        velocity: {
          x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
          y: {
            current: -PLAYER_DEATH_LAUNCH_VELOCITY,
            max: PLAYER_MAX_JUMP_VELOCITY,
          },
        },
        hearts: { value: 2 },
        timers: { death: 0, invincibility: 0, star: 0, hurt: 0 },
        statuses: {
          isFacingRight: true,
          isGrounded: false,
          isJumpQueued: false,
        },
      },
      deaths: 2,
      status: 'PLAYING',
    });
  });
});
