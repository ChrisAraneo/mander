import { createRandom } from '@mander/common';
import {
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { createLevelPatrols } from './create-level-patrols';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  b: TILE_BEARTRAP,
};

const NO_CHANCE = 0;
const FIRST_SPAWN_LEFT = 69;
const SECOND_SPAWN_LEFT = 101;
const SPAWN_TOP = 42;

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: NO_CHANCE,
  fastEnemyChance: NO_CHANCE,
  shooterEnemyChance: NO_CHANCE,
  freezingEnemyChance: NO_CHANCE,
});

const PAIR_LEVEL = createLevel(['.....', '..ee.', '#####']);

const BEARTRAP_LEVEL = createLevel(['.....', '..b..', '#####']);

describe('createLevelPatrols', () => {
  it('should set one enemy on every enemy tile when the level has enemy tiles', () => {
    const patrols = createLevelPatrols(PAIR_LEVEL, createRandom('SEED'));

    expect(map(patrols, (patrol) => patrol.position)).toEqual([
      { x: FIRST_SPAWN_LEFT, y: SPAWN_TOP },
      { x: SECOND_SPAWN_LEFT, y: SPAWN_TOP },
    ]);
  });

  it('should set no enemies when the level has no enemy tiles', () => {
    const patrols = createLevelPatrols(BEARTRAP_LEVEL, createRandom('SEED'));

    expect(patrols).toEqual([]);
  });

  it('should give the same enemies twice when the same generator is seeded again', () => {
    const first = createLevelPatrols(PAIR_LEVEL, createRandom('SEED'));
    const second = createLevelPatrols(PAIR_LEVEL, createRandom('SEED'));

    expect(first).toEqual(second);
  });

  it('should leave the level unchanged when it sets the enemies', () => {
    createLevelPatrols(PAIR_LEVEL, createRandom('SEED'));

    expect(PAIR_LEVEL).toEqual(createLevel(['.....', '..ee.', '#####']));
  });
});
