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
import { createBeartraps } from './create-beartraps';
import { isWithinBeartrapRange } from './is-within-beartrap-range';

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

const LEVEL = createLevel(['.....', '..b..', '#####']);

const TRAP: Enemy = {
  ...createBeartraps(LEVEL)[0],
  position: { x: 100, y: 74 },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 20 },
});

describe('isWithinBeartrapRange', () => {
  it('should say yes when the player stands right above the beartrap', () => {
    const player = createPlayerAt(100);

    const isWithin = isWithinBeartrapRange(TRAP, player);

    expect(isWithin).toBe(true);
  });

  it('should say yes when the player is exactly two tiles to the right of the beartrap', () => {
    const player = createPlayerAt(164);

    const isWithin = isWithinBeartrapRange(TRAP, player);

    expect(isWithin).toBe(true);
  });

  it('should say yes when the player is exactly two tiles to the left of the beartrap', () => {
    const player = createPlayerAt(36);

    const isWithin = isWithinBeartrapRange(TRAP, player);

    expect(isWithin).toBe(true);
  });

  it('should say no when the player is just beyond two tiles to the right of the beartrap', () => {
    const player = createPlayerAt(165);

    const isWithin = isWithinBeartrapRange(TRAP, player);

    expect(isWithin).toBe(false);
  });

  it('should say no when the player is just beyond two tiles to the left of the beartrap', () => {
    const player = createPlayerAt(35);

    const isWithin = isWithinBeartrapRange(TRAP, player);

    expect(isWithin).toBe(false);
  });
});
