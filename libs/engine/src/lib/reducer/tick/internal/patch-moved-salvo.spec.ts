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

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createPatrol } from '../../enemy/internal/create-patrol';
import { nextShooters } from '../../enemy/next-shooters';
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
});

const LEVEL = createLevel([
  repeat('.', 10),
  repeat('.', 10),
  `s..e${repeat('.', 6)}`,
  repeat('#', 10),
]);

const DELTA_SECONDS = 0.02;

const createState = (enemies: Enemy[]): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  enemies,
});

const createShooter = (left: number, reload: number): Enemy => ({
  ...createPatrol({ x: left, y: 64 }, 'SHOOTER'),
  timers: { death: null, reload },
  statuses: { isFacingRight: true, isGrounded: true },
});

const PLAYER = createInitialState(LEVEL, 0, []).player;

describe('patchMovedSalvo', () => {
  it('should move the enemies on and let the shooters fire when the tick passes', () => {
    const state = createState([createShooter(96, 0)]);

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
    const state = createState([createShooter(96, 0)]);

    const salvo = patchMovedSalvo(state, PLAYER, DELTA_SECONDS);

    expect(salvo.cannonballs).toHaveLength(1);
  });

  it('should fire nothing when the shooter is still loading', () => {
    const state = createState([createShooter(96, 5)]);

    const salvo = patchMovedSalvo(state, PLAYER, DELTA_SECONDS);

    expect(salvo.cannonballs).toEqual([]);
  });

  it('should fire nothing when the level has no shooters', () => {
    const state = createState([createPatrol({ x: 96, y: 64 }, 'HOPPING')]);

    const salvo = patchMovedSalvo(state, PLAYER, DELTA_SECONDS);

    expect(salvo.cannonballs).toEqual([]);
    expect(salvo.enemies).toHaveLength(1);
  });
});
