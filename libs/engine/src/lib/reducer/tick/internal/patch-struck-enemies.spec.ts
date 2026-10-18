import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { startEnemyDeath } from '../../enemy/start-enemy-death';
import { patchStruckEnemies } from './patch-struck-enemies';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.......', '.e.e.e.', '#######']);

const createLevelEnemies = (): Enemy[] => createEnemies(LEVEL);

describe('patchStruckEnemies', () => {
  it('should start the death of every enemy when the enemy is among the victims', () => {
    const enemies = createLevelEnemies();

    const patched = patchStruckEnemies(enemies, [enemies[0], enemies[2]]);

    expect(patched[0]).toEqual(startEnemyDeath(enemies[0]));
    expect(patched[2]).toEqual(startEnemyDeath(enemies[2]));
  });

  it('should give back the very same enemy when the enemy is not among the victims', () => {
    const enemies = createLevelEnemies();

    const patched = patchStruckEnemies(enemies, [enemies[0], enemies[2]]);

    expect(patched[1]).toBe(enemies[1]);
  });

  it('should give an equal list of enemies when there are no victims', () => {
    const enemies = createLevelEnemies();

    const patched = patchStruckEnemies(enemies, []);

    expect(patched).toEqual(enemies);
  });

  it('should leave the given enemies alone when some of them are struck', () => {
    const enemies = createLevelEnemies();

    patchStruckEnemies(enemies, [enemies[1]]);

    expect(enemies).toEqual(createLevelEnemies());
  });
});
