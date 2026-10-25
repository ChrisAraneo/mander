import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createFiredBullet } from '../../bullet/create-fired-bullet';
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
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const INITIAL_STATE = createInitialState(LEVEL, 0, []);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  ammo: 2,
  bullets: [
    createFiredBullet({
      ...INITIAL_STATE.player,
      position: { ...INITIAL_STATE.player.position, x: 3 },
    }),
  ],
});

describe('patchFiredBullet', () => {
  it('should use up one bullet when the player shoots', () => {
    const patched = patchFiredBullet(createState());

    expect(patched.ammo).toBe(1);
  });

  it('should add the bullet fired from the player after the ones in flight when the player shoots', () => {
    const state = createState();

    const patched = patchFiredBullet(state);

    expect(patched.bullets).toEqual([
      ...state.bullets,
      createFiredBullet(state.player),
    ]);
  });

  it('should leave the given state unchanged when the player shoots', () => {
    const state = createState();

    patchFiredBullet(state);

    expect(state).toEqual(createState());
  });
});
