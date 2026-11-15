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
import { head, map, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { isOverlappingSpike } from '../spike/is-overlapping-spike';
import type { GameLevel } from '../state/types/game-level';

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

const SPIKE_ROW = 11;

const SPIKE_LEFT = SPIKE_COLUMN * TILE_SIZE;

const SPIKE_TOP = SPIKE_ROW * TILE_SIZE;

const PROBE_HEIGHT = 6;

const PRONG_TIP_OFFSET_Y = 23;

const NOTCH_OFFSET_X = 8;

const NOTCH_OFFSET_Y = 9;

const NOTCH_WIDTH = 5;

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

const patchSpikeTile = (level: GameLevel, column: number): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (row, rowIndex) =>
    map(row, (tile, columnIndex) =>
      match(rowIndex === SPIKE_ROW && columnIndex === column)
        .with(true, () => TILE_SPIKE)
        .otherwise(() => tile),
    ),
  ),
});

const createSpikeLevel = (column: number): GameLevel =>
  patchSpikeTile(createTestLevel(), column);

describe('isOverlappingSpike', () => {
  it('should not be triggered when the box sits in the clear air above the prongs', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);

    expect(
      isOverlappingSpike(level, SPIKE_LEFT, SPIKE_TOP, TILE_SIZE, PROBE_HEIGHT),
    ).toBe(false);
  });

  it('should be triggered when the box reaches down into the prongs', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);

    expect(
      isOverlappingSpike(
        level,
        SPIKE_LEFT,
        SPIKE_TOP + PRONG_TIP_OFFSET_Y,
        TILE_SIZE,
        PROBE_HEIGHT,
      ),
    ).toBe(true);
  });

  it('should not be triggered when the box sits in the notch between two prongs', () => {
    const level = createSpikeLevel(SPIKE_COLUMN);

    expect(
      isOverlappingSpike(
        level,
        SPIKE_LEFT + NOTCH_OFFSET_X,
        SPIKE_TOP + NOTCH_OFFSET_Y,
        NOTCH_WIDTH,
        PROBE_HEIGHT,
      ),
    ).toBe(false);
  });
});
