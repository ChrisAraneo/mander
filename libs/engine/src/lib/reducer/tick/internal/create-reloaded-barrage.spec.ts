import { type Tile, TILE_AIR, TILE_CANNON, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createCannons } from '../../cannon/create-cannons';
import { createReloadedBarrage } from './create-reloaded-barrage';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  c: TILE_CANNON,
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

describe('createReloadedBarrage', () => {
  it('should put every cannon of the level back with no cannonballs in the air when the barrage is reloaded', () => {
    const level = createLevel(['..c..', '.....', 'c...c', '#####']);

    const barrage = createReloadedBarrage(level);

    expect(barrage).toEqual({ cannons: createCannons(level), cannonballs: [] });
  });
});
