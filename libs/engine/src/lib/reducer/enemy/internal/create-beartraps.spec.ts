import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BEARTRAP_JUMP_VELOCITY } from '../consts';
import { createBeartraps } from './create-beartraps';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
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
});

const createExpectedBeartrap = (left: number, top: number): Enemy => ({
  kind: 'BEARTRAP',
  position: { x: left, y: top },
  velocity: {
    x: { current: 0, max: 0 },
    y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: left, y: top },
  statuses: { isFacingRight: true, isGrounded: false },
});

describe('createBeartraps', () => {
  it('should set one beartrap on each beartrap tile when the level has beartrap tiles', () => {
    const level = createLevel(['.....', '.b..b', '#####']);

    const beartraps = createBeartraps(level);

    expect(beartraps).toEqual([
      createExpectedBeartrap(37, 42),
      createExpectedBeartrap(133, 42),
    ]);
  });

  it('should place each beartrap at its spawn point without sharing the same point when it is set', () => {
    const level = createLevel(['.....', '..b..', '#####']);

    const [beartrap] = createBeartraps(level);

    expect(beartrap.position).toEqual(beartrap.spawn);
    expect(beartrap.position).not.toBe(beartrap.spawn);
  });

  it('should set no beartraps when the level only has walking enemies', () => {
    const level = createLevel(['.....', '..e..', '#####']);

    const beartraps = createBeartraps(level);

    expect(beartraps).toEqual([]);
  });

  it('should set no beartraps when the level has no beartrap tiles', () => {
    const level = createLevel(['.....', '.....', '#####']);

    const beartraps = createBeartraps(level);

    expect(beartraps).toEqual([]);
  });
});
