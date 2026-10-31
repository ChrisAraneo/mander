import type { GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { tryCreateLevelAction } from './try-create-level-action';

const createLevel = (seed: string): GameLevel => ({
  seed,
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVELS = [createLevel('FIRST'), createLevel('SECOND')];

describe('tryCreateLevelAction', () => {
  it('should load the level when the world has it', () => {
    expect(tryCreateLevelAction(LEVELS, 1)).toEqual({
      type: 'LOAD_LEVEL',
      level: LEVELS[1],
      levelIndex: 1,
    });
  });

  it('should give nothing when the world has no level that far', () => {
    expect(tryCreateLevelAction(LEVELS, 2)).toBeUndefined();
  });

  it('should give nothing when the world has no levels', () => {
    expect(tryCreateLevelAction([], 0)).toBeUndefined();
  });
});
