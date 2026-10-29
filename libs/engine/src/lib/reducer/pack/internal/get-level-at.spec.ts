import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { getLevelAt } from './get-level-at';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
};

const createLevel = (seed: string, rows: string[]): GameLevel => ({
  seed,
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVELS: GameLevel[] = [
  createLevel('ONE', ['...', '###']),
  createLevel('TWO', ['....', '####']),
];

describe('getLevelAt', () => {
  it('should give the first level when it is asked for the start of the world', () => {
    const level = getLevelAt(LEVELS, 0);

    expect(level).toBe(LEVELS[0]);
  });

  it('should give the second level when it is asked for the next one', () => {
    const level = getLevelAt(LEVELS, 1);

    expect(level).toBe(LEVELS[1]);
  });

  it('should give nothing when it is asked for a level beyond the end of the world', () => {
    const level = getLevelAt(LEVELS, 2);

    expect(level).toBeUndefined();
  });

  it('should give nothing when the world has no levels', () => {
    const level = getLevelAt([], 0);

    expect(level).toBeUndefined();
  });
});
