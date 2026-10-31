import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { constant, head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { BASE_HEARTS } from './player/consts';
import { getSpawnPosition } from './player/get-spawn-position';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const SPAWN_X = getSpawnPosition(createTestLevel()).x;

describe('restarting after a run ends', () => {
  it('should deal level one again with hearts refilled and nothing scored when the run restarts', () => {
    const chosen = nextGameState(
      {
        ...createInitialState(createTestLevel(), 0, []),
        status: 'CHEST',
      },
      { type: 'CHOOSE_ITEM', index: 0 },
      constant(0),
    );
    const over: GameState = {
      ...chosen,
      time: 40,
      deaths: 2,
      levelIndex: 3,
      score: 12345,
      status: 'GAME_OVER',
    };

    const restarted = nextGameState(
      over,
      {
        type: 'RESTART',
        level: createTestLevel(),
      },
      constant(0),
    );

    expect(restarted.levelIndex, 'back to level one').toBe(0);
    expect(restarted.status).toBe('PLAYING');
    expect(restarted.player.hearts.value, 'with a full complement').toBe(
      BASE_HEARTS,
    );
    expect(restarted.score, 'and nothing carried over').toBe(0);
    expect(restarted.time, 'on a clock wound back to zero').toBe(0);
    expect(restarted.deaths).toBe(0);
    expect(restarted.inventory, 'and an empty pack').toHaveLength(0);
    expect(restarted.player.position.x).toBe(SPAWN_X);
  });
});
