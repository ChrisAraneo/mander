import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { GameLevel } from '../../state/types/game-level';
import { isLedgeAhead } from './is-ledge-ahead';

const BEFORE_LEDGE_LEFT = 41;
const ON_SOLID_GROUND_LEFT = 10;
const PAST_LEDGE_LEFT = 97;
const RIGHT_GROUND_LEFT = 140;

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

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

const LEVEL = createLevel(['......', '......', '##..##']);

const GROUND_TOP = 42;

describe('isLedgeAhead', () => {
  it('should say yes when the enemy walking right reaches the edge of a gap', () => {
    const isLedge = isLedgeAhead(
      LEVEL,
      BEFORE_LEDGE_LEFT,
      GROUND_TOP,
      FACING_RIGHT,
    );

    expect(isLedge).toBe(true);
  });

  it('should say no when the enemy walking right has solid ground ahead', () => {
    const isLedge = isLedgeAhead(
      LEVEL,
      ON_SOLID_GROUND_LEFT,
      GROUND_TOP,
      FACING_RIGHT,
    );

    expect(isLedge).toBe(false);
  });

  it('should say yes when the enemy walking left reaches the edge of a gap', () => {
    const isLedge = isLedgeAhead(
      LEVEL,
      PAST_LEDGE_LEFT,
      GROUND_TOP,
      FACING_LEFT,
    );

    expect(isLedge).toBe(true);
  });

  it('should say no when the enemy walking left has solid ground ahead', () => {
    const isLedge = isLedgeAhead(
      LEVEL,
      RIGHT_GROUND_LEFT,
      GROUND_TOP,
      FACING_LEFT,
    );

    expect(isLedge).toBe(false);
  });
});
