import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { computeMovedSalvo } from './compute-moved-salvo';
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

const LEVEL = createLevel(['........', '........', 's...e...', '########']);

const EMPTY_LEVEL = createLevel([
  '........',
  '........',
  's.......',
  '########',
]);

const DELTA_SECONDS = 0.02;

const PLAYER_X = 120;

const PLAYER_Y = 32;

const createState = (level: GameLevel): GameState =>
  createInitialState(level, FIRST_LEVEL_INDEX, []);

const createMovedPlayer = (): Player => ({
  ...createState(LEVEL).player,
  position: { x: PLAYER_X, y: PLAYER_Y },
});

describe('computeMovedSalvo', () => {
  it('should move the enemies and let the shooters fire when the tick runs', () => {
    const state = createState(LEVEL);
    const player = createMovedPlayer();

    const moved = computeMovedSalvo({
      state,
      player,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(moved.salvo).toEqual(patchMovedSalvo(state, player, DELTA_SECONDS));
  });

  it('should give no enemies and no cannonballs when the level holds none', () => {
    const moved = computeMovedSalvo({
      state: createState(EMPTY_LEVEL),
      player: createMovedPlayer(),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(moved.salvo).toEqual({ enemies: [], cannonballs: [] });
  });

  it('should pass the game, the player and the frame length on', () => {
    const state = createState(LEVEL);
    const player = createMovedPlayer();

    const moved = computeMovedSalvo({
      state,
      player,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(moved.state).toBe(state);
    expect(moved.player).toBe(player);
    expect(moved.deltaSeconds).toBe(DELTA_SECONDS);
  });

  it('should leave the game and the player it was handed untouched when the enemies move', () => {
    const state = createState(LEVEL);
    const player = createMovedPlayer();

    computeMovedSalvo({ state, player, deltaSeconds: DELTA_SECONDS });

    expect(state).toEqual(createState(LEVEL));
    expect(player).toEqual(createMovedPlayer());
  });
});
