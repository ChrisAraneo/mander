import {
  type Item,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../types/game-level';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { isOverlappingSpike } from './spike/is-overlapping-spike';

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

const SPIKE_COLUMN = 6;

const SPIKE_LEFT = SPIKE_COLUMN * TILE_SIZE;

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
  shooterEnemyChance: 0,
});

const patchSpikeTile = (level: GameLevel, column: number): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (row, rowIndex) =>
    map(row, (tile, columnIndex) =>
      match(rowIndex === 11 && columnIndex === column)
        .with(true, () => TILE_SPIKE)
        .otherwise(() => tile),
    ),
  ),
});

const createSpikeLevel = (column: number): GameLevel =>
  patchSpikeTile(createTestLevel(), column);

const isEdgeTouchingSpike = (level: Level, tileLeft: number): boolean =>
  isOverlappingSpike(level, tileLeft + 1, 11 * TILE_SIZE + 8, 8, TILE_SIZE - 8);

describe('lone spikes', () => {
  it('should leave the tile edges clear when nothing sits beside the spike', () => {
    expect(
      isEdgeTouchingSpike(createSpikeLevel(SPIKE_COLUMN), SPIKE_LEFT),
    ).toBe(false);
  });

  it('should fill the tile out to its edge when another spike sits beside it', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);
    level.tiles[11][SPIKE_COLUMN + 1] = TILE_SPIKE;

    expect(isEdgeTouchingSpike(level, SPIKE_LEFT)).toBe(true);
  });

  it('should leave the tile edges clear when the spike beside it hangs from the ceiling', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);
    level.tiles[11][SPIKE_COLUMN + 1] = TILE_SPIKE_CEILING;

    expect(isEdgeTouchingSpike(level, SPIKE_LEFT)).toBe(false);
  });

  it('should still be lethal when the player meets the spike head on', () => {
    expect(
      isOverlappingSpike(
        createSpikeLevel(SPIKE_COLUMN),
        SPIKE_LEFT,
        11 * TILE_SIZE + 23,
        TILE_SIZE,
        6,
      ),
    ).toBe(true);
  });
});
