import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, repeat, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createPatrol } from '../../enemy/create-patrol';
import { nextShooters } from '../../enemy/next-shooters';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchMovedEnemies } from './patch-moved-enemies';
import { patchMovedSalvo } from './patch-moved-salvo';

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
  repeat('.', 10),
  repeat('.', 10),
  `s..e${repeat('.', 6)}`,
  repeat('#', 10),
]);

const DELTA_SECONDS = 0.02;

const SHOOTER_X = 96;

const SHOOTER_Y = 64;

const LOADED_RELOAD_SECONDS = 0;

const LOADING_RELOAD_SECONDS = 5;

const ONE_CANNONBALL = 1;

const ONE_ENEMY = 1;

const createState = (enemies: Enemy[]): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  enemies,
});

const createShooter = (left: number, reload: number): Enemy => ({
  ...createPatrol({ x: left, y: SHOOTER_Y }, 'SHOOTER'),
  timers: { death: null, reload },
  statuses: { isFacingRight: true, isGrounded: true },
});

const PLAYER = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []).player;

describe('patchMovedSalvo', () => {
  it('should move the enemies on and let the shooters fire when the tick passes', () => {
    const state = createState([
      createShooter(SHOOTER_X, LOADED_RELOAD_SECONDS),
    ]);

    const salvo = patchMovedSalvo(state, PLAYER, DELTA_SECONDS);

    expect(salvo).toEqual(
      nextShooters(
        patchMovedEnemies(state, PLAYER, DELTA_SECONDS),
        PLAYER,
        DELTA_SECONDS,
      ),
    );
  });

  it('should fire a cannonball when a loaded shooter has the player in range', () => {
    const state = createState([
      createShooter(SHOOTER_X, LOADED_RELOAD_SECONDS),
    ]);

    const salvo = patchMovedSalvo(state, PLAYER, DELTA_SECONDS);

    expect(salvo.cannonballs).toHaveLength(ONE_CANNONBALL);
  });

  it('should fire nothing when the shooter is still loading', () => {
    const state = createState([
      createShooter(SHOOTER_X, LOADING_RELOAD_SECONDS),
    ]);

    const salvo = patchMovedSalvo(state, PLAYER, DELTA_SECONDS);

    expect(salvo.cannonballs).toEqual([]);
  });

  it('should fire nothing when the level has no shooters', () => {
    const state = createState([
      createPatrol({ x: SHOOTER_X, y: SHOOTER_Y }, 'HOPPING'),
    ]);

    const salvo = patchMovedSalvo(state, PLAYER, DELTA_SECONDS);

    expect(salvo.cannonballs).toEqual([]);
    expect(salvo.enemies).toHaveLength(ONE_ENEMY);
  });

  it('should leave the game and the player it was handed untouched when the salvo moves', () => {
    const state = createState([
      createShooter(SHOOTER_X, LOADED_RELOAD_SECONDS),
    ]);
    const player = PLAYER;

    patchMovedSalvo(state, player, DELTA_SECONDS);

    expect(state).toEqual(
      createState([createShooter(SHOOTER_X, LOADED_RELOAD_SECONDS)]),
    );
    expect(player).toEqual(
      createInitialState(LEVEL, FIRST_LEVEL_INDEX, []).player,
    );
  });
});
