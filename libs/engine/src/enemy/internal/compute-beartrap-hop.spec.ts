import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { BEARTRAP_JUMP_VELOCITY } from '../consts';
import { createEnemies } from '../create-enemies';
import { computeBeartrapHop } from './compute-beartrap-hop';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  b: TILE_BEARTRAP,
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
  freezingEnemyChance: 0,
});

const TRAP_LEFT = 100;
const TRAP_TOP = 74;
const PLAYER_TOP = 50;
const FAR_LEFT = 300;
const NO_FALL_SPEED = 0;
const SLOW_FALL_SPEED = 12;
const FAST_FALL_SPEED = 150;

const LEVEL = createLevel(['.....', '..b..', '#####']);

const TRAP: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: TRAP_LEFT, y: TRAP_TOP },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const createDeadPlayerAt = (left: number): Player => ({
  ...createPlayerAt(left),
  timers: { ...BASE_PLAYER.timers, death: 0 },
});

describe('computeBeartrapHop', () => {
  it('should make the trap leap when it is on the ground and the player comes near', () => {
    const player = createPlayerAt(TRAP_LEFT);

    const hop = computeBeartrapHop(TRAP, player, NO_FALL_SPEED, true);

    expect(hop).toEqual({
      velocityY: -BEARTRAP_JUMP_VELOCITY,
      isGrounded: false,
    });
  });

  it('should keep the trap as it was when it is on the ground and the player is far away', () => {
    const player = createPlayerAt(FAR_LEFT);

    const hop = computeBeartrapHop(TRAP, player, SLOW_FALL_SPEED, true);

    expect(hop).toEqual({ velocityY: SLOW_FALL_SPEED, isGrounded: true });
  });

  it('should keep the trap as it was when it is already in the air and the player comes near', () => {
    const player = createPlayerAt(TRAP_LEFT);

    const hop = computeBeartrapHop(TRAP, player, FAST_FALL_SPEED, false);

    expect(hop).toEqual({ velocityY: FAST_FALL_SPEED, isGrounded: false });
  });

  it('should keep the trap as it was when the player near it is dead', () => {
    const player = createDeadPlayerAt(TRAP_LEFT);

    const hop = computeBeartrapHop(TRAP, player, SLOW_FALL_SPEED, true);

    expect(hop).toEqual({ velocityY: SLOW_FALL_SPEED, isGrounded: true });
  });
});
