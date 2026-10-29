import {
  type Fireball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { constant, times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { FIREBALL_ORBIT_RADIUS } from './fireball/consts';
import { nextGameState } from './next-game-state';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './player/consts';

const { number } = P;

const WIDTH = 20;

const HEIGHT = 14;

const GROUND_ROW = 10;

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row) =>
    times(WIDTH, (column) =>
      match({ row, column })
        .with({ row: GROUND_ROW - 1, column: 2 }, (): Tile => TILE_SPAWN)
        .with({ row: GROUND_ROW - 2, column: 2 }, (): Tile => TILE_SPAWN)
        .with({ row: GROUND_ROW - 1, column: 12 }, (): Tile => TILE_FIREBALL)
        .with({ row: number.gte(GROUND_ROW) }, (): Tile => TILE_DIRT)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
  shooterEnemyChance: 0,
});

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const createFireballOnPlayer = (state: GameState): Fireball => ({
  spin: 'CLOCKWISE',
  origin: {
    x: state.player.position.x + PLAYER_WIDTH / 2 - FIREBALL_ORBIT_RADIUS,
    y: state.player.position.y + PLAYER_HEIGHT / 2,
  },
  angle: 0,
});

describe('fireballs on the tick', () => {
  it('should light every fireball block when the level loads', () => {
    expect(createInitialState(createTestLevel(), 0, []).fireballs).toHaveLength(
      1,
    );
  });

  it('should keep the fireball circling its own block when the clock runs on', () => {
    const state = createInitialState(createTestLevel(), 0, []);
    const turned = nextTick(state);

    expect(turned.fireballs[0].angle).not.toBe(state.fireballs[0].angle);
    expect(turned.fireballs[0].origin).toEqual({
      x: 12 * TILE_SIZE + TILE_SIZE / 2,
      y: (GROUND_ROW - 1) * TILE_SIZE + TILE_SIZE / 2,
    });
  });

  it('should burn a heart off the player when the fireball sweeps through them', () => {
    const state = nextTick(createInitialState(createTestLevel(), 0, []));
    const hearts = state.player.hearts.value;
    const burned = nextTick({
      ...state,
      fireballs: [createFireballOnPlayer(state)],
    });

    expect(burned.player.hearts.value).toBe(hearts - 1);
  });

  it('should leave the player alone when the fireball circles somewhere else', () => {
    const state = nextTick(createInitialState(createTestLevel(), 0, []));

    expect(nextTick(state).player.hearts.value).toBe(state.player.hearts.value);
  });
});
