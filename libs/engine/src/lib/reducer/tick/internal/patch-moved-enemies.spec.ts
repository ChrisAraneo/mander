import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createEnemies } from '../../enemy/create-enemies';
import { patchEnemy } from '../../enemy/patch-enemy';
import { patchMovedEnemies } from './patch-moved-enemies';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel([
  '..........',
  '..........',
  's..e...e..',
  '##########',
]);

const DELTA_SECONDS = 0.02;

const createEnemyWith = (index: number, death: number | null): Enemy => ({
  ...createEnemies(LEVEL)[index],
  timers: { death },
});

const createState = (enemies: Enemy[]): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  enemies,
});

const PLAYER: Player = createInitialState(LEVEL, 0, []).player;

describe('patchMovedEnemies', () => {
  it('should move every enemy on when the enemies are alive', () => {
    const state = createState(createEnemies(LEVEL));

    const enemies = patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(enemies).toEqual(
      map(state.enemies, (enemy) =>
        patchEnemy(LEVEL, enemy, PLAYER, DELTA_SECONDS),
      ),
    );
  });

  it('should drop the enemy when it has finished fading away', () => {
    const living = createEnemyWith(0, null);
    const state = createState([living, createEnemyWith(1, 0.29)]);

    const enemies = patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(enemies).toEqual([patchEnemy(LEVEL, living, PLAYER, DELTA_SECONDS)]);
  });

  it('should keep the dying enemy and move its death on when it has not finished fading away', () => {
    const state = createState([createEnemyWith(1, 0.1)]);

    const enemies = patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(size(enemies)).toBe(1);
    expect(enemies[0].timers.death).toBeCloseTo(0.12, 6);
  });

  it('should give no enemies when the level has no enemies', () => {
    const state = createState([]);

    const enemies = patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(enemies).toEqual([]);
  });

  it('should leave the given game alone when the enemies move', () => {
    const state = createState([
      createEnemyWith(0, null),
      createEnemyWith(1, 0.29),
    ]);

    patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(state).toEqual(
      createState([createEnemyWith(0, null), createEnemyWith(1, 0.29)]),
    );
  });
});
