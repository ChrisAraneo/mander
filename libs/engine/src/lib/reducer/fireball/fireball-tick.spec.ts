import {
  type Fireball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import type { GameLevel } from '../../types/game-level';
import { reduce } from '../reduce';
import { FIREBALL_ORBIT_RADIUS } from './consts';

const WIDTH = 20;
const HEIGHT = 14;
const GROUND_ROW = 10;

const DELTA_SECONDS = 1 / 60;

const testLevel = (): GameLevel => {
  const tiles: Tile[][] = times(HEIGHT, (row) =>
    times(WIDTH, (): Tile => (row >= GROUND_ROW ? TILE_DIRT : TILE_AIR)),
  );

  tiles[GROUND_ROW - 1][2] = TILE_SPAWN;
  tiles[GROUND_ROW - 2][2] = TILE_SPAWN;
  tiles[GROUND_ROW - 1][12] = TILE_FIREBALL;

  return {
    seed: 'TEST',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    chestItems: [],
    hornedEnemyChance: HORNED_ENEMY_CHANCE,
  };
};

const tick = (state: GameState): GameState =>
  reduce(state, { type: 'TICK', deltaSeconds: DELTA_SECONDS });

const onTopOfPlayer = (state: GameState): Fireball => ({
  spin: 'CLOCKWISE',
  origin: {
    x: state.player.position.x + PLAYER_WIDTH / 2 - FIREBALL_ORBIT_RADIUS,
    y: state.player.position.y + PLAYER_HEIGHT / 2,
  },
  angle: 0,
});

describe('fireballs on the tick', () => {
  it('should light every fireball block when the level loads', () => {
    expect(createInitialState(testLevel(), 0, []).fireballs).toHaveLength(1);
  });

  it('should keep the fireball circling its own block as the clock runs', () => {
    const state = createInitialState(testLevel(), 0, []);
    const turned = tick(state);

    expect(turned.fireballs[0].angle).not.toBe(state.fireballs[0].angle);
    expect(turned.fireballs[0].origin).toEqual({
      x: 12 * TILE_SIZE + TILE_SIZE / 2,
      y: (GROUND_ROW - 1) * TILE_SIZE + TILE_SIZE / 2,
    });
  });

  it('should burn a heart off the player it sweeps through', () => {
    const state = tick(createInitialState(testLevel(), 0, []));
    const hearts = state.player.hearts.value;
    const burned = tick({ ...state, fireballs: [onTopOfPlayer(state)] });

    expect(burned.player.hearts.value).toBe(hearts - 1);
  });

  it('should leave the player alone while it circles somewhere else', () => {
    const state = tick(createInitialState(testLevel(), 0, []));

    expect(tick(state).player.hearts.value).toBe(state.player.hearts.value);
  });
});
