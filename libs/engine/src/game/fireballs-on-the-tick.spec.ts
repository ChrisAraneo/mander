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

import { HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { FIREBALL_ORBIT_RADIUS } from '../fireball/consts';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { COLD_SECONDS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { nextGameState } from './next-game-state';

const { number } = P;

const WIDTH = 20;

const HEIGHT = 14;

const GROUND_ROW = 10;

const SPAWN_COLUMN = 2;

const FIREBALL_COLUMN = 12;

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row) =>
    times(WIDTH, (column) =>
      match({ row, column })
        .with(
          { row: GROUND_ROW - 1, column: SPAWN_COLUMN },
          (): Tile => TILE_SPAWN,
        )
        .with(
          { row: GROUND_ROW - 2, column: SPAWN_COLUMN },
          (): Tile => TILE_SPAWN,
        )
        .with(
          { row: GROUND_ROW - 1, column: FIREBALL_COLUMN },
          (): Tile => TILE_FIREBALL,
        )
        .with({ row: number.gte(GROUND_ROW) }, (): Tile => TILE_DIRT)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const createFireballOnPlayer = (
  state: GameState,
  kind: Fireball['kind'] = 'FIRE',
): Fireball => ({
  kind,
  spin: 'CLOCKWISE',
  origin: {
    x: state.player.position.x + PLAYER_WIDTH / 2 - FIREBALL_ORBIT_RADIUS,
    y: state.player.position.y + PLAYER_HEIGHT / 2,
  },
  angle: match(kind)
    .with('PINK', () => Math.PI)
    .otherwise(() => 0),
});

describe('fireballs on the tick', () => {
  it('should light every fireball block when the level loads', () => {
    expect(
      createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []).fireballs,
    ).toHaveLength(1);
  });

  it('should keep the fireball circling its own block when the clock runs on', () => {
    const state = createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []);
    const turned = nextTick(state);

    expect(turned.fireballs[0].angle).not.toBe(state.fireballs[0].angle);
    expect(turned.fireballs[0].origin).toEqual({
      x: FIREBALL_COLUMN * TILE_SIZE + TILE_SIZE / 2,
      y: (GROUND_ROW - 1) * TILE_SIZE + TILE_SIZE / 2,
    });
  });

  it('should burn a heart off the player when the fireball sweeps through them', () => {
    const state = nextTick(
      createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []),
    );
    const hearts = state.player.hearts.value;
    const burned = nextTick({
      ...state,
      fireballs: [createFireballOnPlayer(state)],
    });

    expect(burned.player.hearts.value).toBe(hearts - 1);
  });

  it('should leave the player alone when the fireball circles somewhere else', () => {
    const state = nextTick(
      createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []),
    );

    expect(nextTick(state).player.hearts.value).toBe(state.player.hearts.value);
  });

  it('should burn a heart off the player when the pink ball sweeps through them', () => {
    const state = nextTick(
      createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []),
    );
    const hearts = state.player.hearts.value;
    const burned = nextTick({
      ...state,
      fireballs: [createFireballOnPlayer(state, 'PINK')],
    });

    expect(burned.player.hearts.value).toBe(hearts - 1);
  });

  it('should freeze the player when the ice ball sweeps through them', () => {
    const state = nextTick(
      createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []),
    );
    const chilled = nextTick({
      ...state,
      fireballs: [createFireballOnPlayer(state, 'ICE')],
    });

    expect(chilled.player.timers.cold).toBe(COLD_SECONDS);
  });

  it('should take no heart off the player when the ice ball sweeps through them', () => {
    const state = nextTick(
      createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []),
    );
    const chilled = nextTick({
      ...state,
      fireballs: [createFireballOnPlayer(state, 'ICE')],
    });

    expect(chilled.player.hearts.value).toBe(state.player.hearts.value);
  });
  it('should not change the game it was handed when a tick passes', () => {
    const state = createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []);
    const before = createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []);

    nextTick(state);

    expect(state).toEqual(before);
  });
});
