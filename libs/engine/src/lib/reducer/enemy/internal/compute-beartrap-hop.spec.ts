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

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..b..', '#####']);

const TRAP: Enemy = {
  ...createEnemies(LEVEL)[0],
  position: { x: 100, y: 74 },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 50 },
});

const createDeadPlayerAt = (left: number): Player => ({
  ...createPlayerAt(left),
  timers: { ...BASE_PLAYER.timers, death: 0 },
});

describe('computeBeartrapHop', () => {
  it('should make the trap leap when it is on the ground and the player comes near', () => {
    const player = createPlayerAt(100);

    const hop = computeBeartrapHop(true, 0, TRAP, player);

    expect(hop).toEqual({
      velocityY: -BEARTRAP_JUMP_VELOCITY,
      isGrounded: false,
    });
  });

  it('should keep the trap as it was when it is on the ground and the player is far away', () => {
    const player = createPlayerAt(300);

    const hop = computeBeartrapHop(true, 12, TRAP, player);

    expect(hop).toEqual({ velocityY: 12, isGrounded: true });
  });

  it('should keep the trap as it was when it is already in the air and the player comes near', () => {
    const player = createPlayerAt(100);

    const hop = computeBeartrapHop(false, 150, TRAP, player);

    expect(hop).toEqual({ velocityY: 150, isGrounded: false });
  });

  it('should keep the trap as it was when the player near it is dead', () => {
    const player = createDeadPlayerAt(100);

    const hop = computeBeartrapHop(true, 12, TRAP, player);

    expect(hop).toEqual({ velocityY: 12, isGrounded: true });
  });
});
