import { type Item, type Tile, TILE_AIR, TILE_CHEST, TILE_DIRT, TILE_KEY, TILE_PORTAL, TILE_SIZE, TILE_SPAWN, TILE_SPIKE_CEILING, chain } from '@mander/model';
import { head, map, reduce as fold, size, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { BASE_HEARTS, PLAYER_HEIGHT } from './player/consts';
import { reduce } from './reduce';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  K: TILE_KEY,
  C: TILE_CHEST,
  P: TILE_PORTAL,
};

const ROWS = [
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#.S......................P...#',
  '#.S............K....C....P...#',
  '##########..##################',
  '##########..##################',
  '##########..##################',
];

const SURFACE = 12 * TILE_SIZE;

const SPIKE_COLUMN = 6;

const SPIKE_ROW = 9;

const createItem = (id: string, effect?: Item['effect']): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: effect ?? { kind: 'NONE' },
});

const CARDS: Item[] = [
  createItem('CARD-0'),
  createItem('CARD-1'),
  createItem('CARD-2'),
  createItem('CARD-3'),
  createItem('CARD-4'),
];

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});

const createCeilingSpikeLevel = (column: number, row: number): GameLevel =>
  chain(createTestLevel())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (tiles, rowIndex) =>
        map(tiles, (tile, columnIndex) =>
          match({ isSpikeColumn: columnIndex === column, rowIndex })
            .with({ isSpikeColumn: true, rowIndex: row - 1 }, () => TILE_DIRT)
            .with(
              { isSpikeColumn: true, rowIndex: row },
              () => TILE_SPIKE_CEILING,
            )
            .otherwise(() => tile),
        ),
      ),
    }))
    .value();

const nextTick = (state: GameState): GameState =>
  reduce(state, { type: 'TICK' });

const nextTicks = (state: GameState, tickCount: number): GameState =>
  fold(times(tickCount), (current) => nextTick(current), state);

describe('ceiling spikes', () => {
  it('should cost a heart when the player jumps up into the prongs', () => {
    const start = createInitialState(
      createCeilingSpikeLevel(SPIKE_COLUMN, SPIKE_ROW),
      0,
      [],
    );
    const placed = {
      ...start,
      player: {
        ...start.player,
        position: { x: SPIKE_COLUMN * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const settled = nextTick(placed);

    expect(settled.player.hearts.value, 'safe while standing underneath').toBe(
      BASE_HEARTS,
    );

    const jumped = reduce(settled, { type: 'JUMP_START' });
    const ticked = nextTicks(jumped, 20);

    expect(ticked.player.hearts.value, 'the jump ran into the prongs').toBe(
      BASE_HEARTS - 1,
    );
    expect(ticked.player.timers.invincibility).toBeGreaterThan(0);
    expect(
      ticked.player.timers.death,
      'a prong is not fatal on its own',
    ).toBeNull();
  });

  it('should spare the player when they stay under the prongs', () => {
    const start = createInitialState(
      createCeilingSpikeLevel(SPIKE_COLUMN, SPIKE_ROW),
      0,
      [],
    );
    const placed = {
      ...start,
      player: {
        ...start.player,
        position: { x: SPIKE_COLUMN * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const pressed = reduce(placed, { type: 'MOVE_RIGHT_START' });
    const moved = nextTicks(pressed, 60);

    expect(moved.deaths, 'running underneath is safe').toBe(0);
    expect(moved.player.position.x, 'walked on past').toBeGreaterThan(
      SPIKE_COLUMN * TILE_SIZE,
    );
  });
});
