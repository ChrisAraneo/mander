import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { isLedgeAhead } from './is-ledge-ahead';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['......', '......', '##..##']);

const GROUND_TOP = 42;

describe('isLedgeAhead', () => {
  it('should say yes when the enemy walking right reaches the edge of a gap', () => {
    const isLedge = isLedgeAhead(LEVEL, 41, GROUND_TOP, 1);

    expect(isLedge).toBe(true);
  });

  it('should say no when the enemy walking right has solid ground ahead', () => {
    const isLedge = isLedgeAhead(LEVEL, 10, GROUND_TOP, 1);

    expect(isLedge).toBe(false);
  });

  it('should say yes when the enemy walking left reaches the edge of a gap', () => {
    const isLedge = isLedgeAhead(LEVEL, 97, GROUND_TOP, -1);

    expect(isLedge).toBe(true);
  });

  it('should say no when the enemy walking left has solid ground ahead', () => {
    const isLedge = isLedgeAhead(LEVEL, 140, GROUND_TOP, -1);

    expect(isLedge).toBe(false);
  });
});
