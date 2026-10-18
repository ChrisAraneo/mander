import { type Tile, TILE_AIR, TILE_CANNON, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { CANNON_RELOAD_SECONDS } from './consts';
import { createCannons } from './create-cannons';

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
});

const createCannonLevel = (): GameLevel =>
  createLevel(['..c..', '.....', 'c...c', '#####']);

describe('createCannons', () => {
  it('should place a loaded cannon facing right on every cannon tile when the level has cannon tiles', () => {
    const level = createCannonLevel();

    const cannons = createCannons(level);

    expect(cannons).toEqual([
      {
        position: { x: 64, y: 0 },
        timers: { reload: CANNON_RELOAD_SECONDS },
        statuses: { isFacingRight: true },
      },
      {
        position: { x: 0, y: 64 },
        timers: { reload: CANNON_RELOAD_SECONDS },
        statuses: { isFacingRight: true },
      },
      {
        position: { x: 128, y: 64 },
        timers: { reload: CANNON_RELOAD_SECONDS },
        statuses: { isFacingRight: true },
      },
    ]);
  });

  it('should give no cannons when the level has no cannon tiles', () => {
    const level = createLevel(['.....', '#####']);

    const cannons = createCannons(level);

    expect(cannons).toEqual([]);
  });

  it('should leave the level alone when it places the cannons', () => {
    const level = createCannonLevel();

    createCannons(level);

    expect(level).toEqual(createCannonLevel());
  });
});
