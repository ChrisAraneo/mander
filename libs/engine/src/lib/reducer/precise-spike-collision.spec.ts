import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE,
} from '@mander/model';
import { chain } from '@mander/utils';
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
});

const createSpikeLevel = (column: number): GameLevel =>
  chain(createTestLevel())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (row, rowIndex) =>
        map(row, (tile, columnIndex) =>
          match(rowIndex === 11 && columnIndex === column)
            .with(true, () => TILE_SPIKE)
            .otherwise(() => tile),
        ),
      ),
    }))
    .value();

describe('precise spike collision', () => {
  it('should not be triggered when the box sits in the clear air above the prongs', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);

    expect(
      isOverlappingSpike(level, SPIKE_LEFT, 11 * TILE_SIZE, TILE_SIZE, 6),
    ).toBe(false);
  });

  it('should be triggered when the box reaches down into the prongs', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);

    expect(
      isOverlappingSpike(level, SPIKE_LEFT, 11 * TILE_SIZE + 23, TILE_SIZE, 6),
    ).toBe(true);
  });

  it('should not be triggered when the box sits in the notch between two prongs', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);

    expect(
      isOverlappingSpike(level, SPIKE_LEFT + 8, 11 * TILE_SIZE + 9, 5, 6),
    ).toBe(false);
  });
});
