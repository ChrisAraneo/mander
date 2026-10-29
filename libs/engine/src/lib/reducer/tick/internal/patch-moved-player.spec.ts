import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { nextPlayer } from '../../player/next-player';
import { patchDyingPlayer } from '../../player/patch-dying-player';
import { patchMovedPlayer } from './patch-moved-player';
import { patchPlayerTimers } from './patch-player-timers';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel([
  '........',
  '........',
  '........',
  's.......',
  '........',
  '########',
]);

const DELTA_SECONDS = 0.02;

const BASE_STATE = createInitialState(LEVEL, 0, []);

const createStateWith = (timers: Player['timers']): GameState => ({
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  player: { ...BASE_STATE.player, timers },
});

describe('patchMovedPlayer', () => {
  it('should move the player as a dying player when the player is dying', () => {
    const state = createStateWith({
      death: 0.1,
      invincibility: 0,
      star: 0,
      hurt: 0,
    });

    const player = patchMovedPlayer(state, DELTA_SECONDS);

    expect(player).toEqual(
      patchDyingPlayer(LEVEL, state.player, 0.1, DELTA_SECONDS),
    );
  });

  it('should leave the invincibility, star and hurt timers alone when the player is dying', () => {
    const state = createStateWith({
      death: 0.1,
      invincibility: 1,
      star: 1,
      hurt: 0.1,
    });

    const player = patchMovedPlayer(state, DELTA_SECONDS);

    expect(player.timers.death).toBeCloseTo(0.12, 6);
    expect(player.timers.invincibility).toBe(1);
    expect(player.timers.star).toBe(1);
    expect(player.timers.hurt).toBe(0.1);
  });

  it('should step the living player and then cool its timers down when the player is alive', () => {
    const state = createStateWith({
      death: null,
      invincibility: 1,
      star: 2,
      hurt: 0.1,
    });

    const player = patchMovedPlayer(state, DELTA_SECONDS);

    expect(player).toEqual(
      patchPlayerTimers(
        nextPlayer(LEVEL, state.player, state.input, DELTA_SECONDS),
        DELTA_SECONDS,
      ),
    );
  });

  it('should move the living player to the right and count its timers down when the right button is held', () => {
    const state = createStateWith({
      death: null,
      invincibility: 1,
      star: 2,
      hurt: 0.1,
    });

    const player = patchMovedPlayer(state, DELTA_SECONDS);

    expect(player.position.x).toBeGreaterThan(state.player.position.x);
    expect(player.timers.death).toBe(null);
    expect(player.timers.invincibility).toBeCloseTo(0.98, 6);
    expect(player.timers.star).toBeCloseTo(1.98, 6);
    expect(player.timers.hurt).toBeCloseTo(0.08, 6);
  });

  it('should leave the given game alone when the player moves', () => {
    const state = createStateWith({
      death: null,
      invincibility: 1,
      star: 2,
      hurt: 0.1,
    });

    patchMovedPlayer(state, DELTA_SECONDS);

    expect(state).toEqual(
      createStateWith({ death: null, invincibility: 1, star: 2, hurt: 0.1 }),
    );
  });
});
