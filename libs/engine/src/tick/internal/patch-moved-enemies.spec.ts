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

import { ENEMY_DEATH_SECONDS } from '../../enemy/consts';
import { createEnemies } from '../../enemy/create-enemies';
import { patchEnemy } from '../../enemy/patch-enemy';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel([
  '..........',
  '..........',
  's..e...e..',
  '##########',
]);

const DELTA_SECONDS = 0.02;

const ENDING_FADE_SECONDS = ENEMY_DEATH_SECONDS - DELTA_SECONDS / 2;

const DYING_SECONDS = 0.1;

const ONE_ENEMY = 1;

const PRECISION = 6;

const FIRST_ENEMY = 0;

const SECOND_ENEMY = 1;

const createEnemyWith = (index: number, death: number | null): Enemy => ({
  ...createEnemies(LEVEL)[index],
  timers: { death, reload: 0 },
});

const createState = (enemies: Enemy[]): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  enemies,
});

const PLAYER: Player = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []).player;

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
    const living = createEnemyWith(FIRST_ENEMY, null);
    const state = createState([
      living,
      createEnemyWith(SECOND_ENEMY, ENDING_FADE_SECONDS),
    ]);

    const enemies = patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(enemies).toEqual([patchEnemy(LEVEL, living, PLAYER, DELTA_SECONDS)]);
  });

  it('should keep the dying enemy and move its death on when it has not finished fading away', () => {
    const state = createState([createEnemyWith(SECOND_ENEMY, DYING_SECONDS)]);

    const enemies = patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(size(enemies)).toBe(ONE_ENEMY);
    expect(enemies[0].timers.death).toBeCloseTo(
      DYING_SECONDS + DELTA_SECONDS,
      PRECISION,
    );
  });

  it('should give no enemies when the level has no enemies', () => {
    const state = createState([]);

    const enemies = patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(enemies).toEqual([]);
  });

  it('should leave the game it was handed untouched when the enemies move', () => {
    const state = createState([
      createEnemyWith(FIRST_ENEMY, null),
      createEnemyWith(SECOND_ENEMY, ENDING_FADE_SECONDS),
    ]);

    patchMovedEnemies(state, PLAYER, DELTA_SECONDS);

    expect(state).toEqual(
      createState([
        createEnemyWith(FIRST_ENEMY, null),
        createEnemyWith(SECOND_ENEMY, ENDING_FADE_SECONDS),
      ]),
    );
  });
});
