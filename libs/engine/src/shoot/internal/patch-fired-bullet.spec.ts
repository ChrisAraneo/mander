import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFiredBullet } from '../../bullet/create-fired-bullet';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchFiredBullet } from './patch-fired-bullet';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
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

const LEVEL = createLevel(['.....', '.S...', '#####']);

const INITIAL_STATE = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

const LOADED_AMMO = 2;

const BULLET_IN_FLIGHT_X = 3;

const createStateWithoutBullets = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  ammo: LOADED_AMMO,
  bullets: [],
});

const createState = (): GameState => ({
  ...createStateWithoutBullets(),
  bullets: [
    createFiredBullet({
      ...INITIAL_STATE.player,
      position: { ...INITIAL_STATE.player.position, x: BULLET_IN_FLIGHT_X },
    }),
  ],
});

describe('patchFiredBullet', () => {
  it('should use up one bullet when the player shoots', () => {
    const patched = patchFiredBullet(createState());

    expect(patched.ammo).toBe(LOADED_AMMO - 1);
  });

  it('should add the bullet fired from the player after the ones in flight when the player shoots', () => {
    const state = createState();

    const patched = patchFiredBullet(state);

    expect(patched.bullets).toEqual([
      ...state.bullets,
      createFiredBullet(state.player),
    ]);
  });

  it('should put the bullet fired from the player in the air when nothing is in flight yet', () => {
    const state = createStateWithoutBullets();

    const patched = patchFiredBullet(state);

    expect(patched.bullets).toEqual([createFiredBullet(state.player)]);
    expect(patched.ammo).toBe(LOADED_AMMO - 1);
  });

  it('should leave the game it was handed untouched when the player shoots', () => {
    const state = createState();

    patchFiredBullet(state);

    expect(state).toEqual(createState());
  });
});
