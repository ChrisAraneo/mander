import {
  type Item,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
  chain,
} from '@mander/model';
import { map, reduce as fold, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { createFallingSpikes } from './falling-spike/create-falling-spikes';
import { BASE_HEARTS } from './player/consts';
import { reduce } from './reduce';

const CEILING_ROW = 1;

const FLOOR_ROW = 8;

const SPIKE_COLUMN = 5;

const WIDTH = 12;

const HEIGHT = 10;

const createRoom = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column) =>
      match({
        isDirt: row === 0 || row === FLOOR_ROW,
        isSpike: row === CEILING_ROW && column === SPIKE_COLUMN,
      })
        .with({ isDirt: true }, (): Tile => TILE_DIRT)
        .with({ isSpike: true }, (): Tile => TILE_SPIKE_FALLING)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
});

const createArena = (): GameLevel =>
  chain(createRoom())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (tiles, rowIndex) =>
        map(tiles, (tile, columnIndex) =>
          match(rowIndex === FLOOR_ROW - 1 && columnIndex === SPIKE_COLUMN)
            .with(true, () => TILE_SPAWN)
            .otherwise(() => tile),
        ),
      ),
      hornedEnemyChance: HORNED_ENEMY_CHANCE,
    }))
    .value();

const nextTick = (state: GameState): GameState =>
  reduce(state, { type: 'TICK' });

const nextTicks = (state: GameState, tickCount: number): GameState =>
  fold(times(tickCount), (current) => nextTick(current), state);

const createPlayedState = (inventory: Item[], tickCount: number): GameState =>
  nextTicks(createInitialState(createArena(), 0, inventory), tickCount);

describe('a level being played', () => {
  it('should cost the player a heart and shatter on the floor when it lands on them', () => {
    const struck = createPlayedState([], 60);

    expect(struck.player.hearts.value).toBe(BASE_HEARTS - 1);
    expect(struck.fallingSpikes).toEqual([]);
  });

  it('should hang again when the player respawns', () => {
    const struck = createPlayedState([], 60);
    const respawned = reduce(struck, { type: 'RESPAWN' });

    expect(respawned.fallingSpikes).toEqual(createFallingSpikes(createArena()));
    expect(respawned.enemies).toEqual([]);
  });
});
