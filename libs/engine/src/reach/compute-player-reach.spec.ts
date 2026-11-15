import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import { every, head, map, range, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computePlayerReach } from './compute-player-reach';
import { isReachableCell } from './is-reachable-cell';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
};

const createLevel = (rows: string[]): Level => ({
  seed: 'TEST',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const FLAT_ROWS = [
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '####################',
];

const FLAT = createLevel(FLAT_ROWS);

const PERCH = createLevel([
  '....................',
  '....................',
  '....................',
  '....................',
  '........###.........',
  '....................',
  '....................',
  '####################',
]);

const TOWER = createLevel([
  '....................',
  '........###.........',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '####################',
]);

const LEDGE_FIVE_UP = createLevel([
  '....................',
  '....................',
  '..........##########',
  '....................',
  '....................',
  '....................',
  '....................',
  '####################',
]);

const LEDGE_FOUR_UP = createLevel([
  '....................',
  '....................',
  '....................',
  '..........##########',
  '....................',
  '....................',
  '....................',
  '####################',
]);

const PIT_FIVE_WIDE = createLevel([
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '#####.....##########',
]);

const PIT_SIX_WIDE = createLevel([
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '#####......#########',
]);

const SPIKE_RUN = createLevel([
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '........^...........',
  '####################',
]);

const FLOATING = createLevel([
  '....................',
  '....................',
  '....................',
  '....................',
  '........###.........',
  '....................',
  '....................',
  '....................',
]);

const WIDTH = size(head(FLAT_ROWS));

const HEIGHT = size(FLAT_ROWS);

const FLOOR_ROW = 7;

const PERCH_ROW = 4;

const TOWER_ROW = 1;

const LEDGE_FIVE_ROW = 2;

const LEDGE_FOUR_ROW = 3;

const PLATFORM_COLUMN = 9;

const FAR_COLUMN = 15;

const FIRST_ROW = 0;

const FIRST_COLUMN = 0;

const OUTSIDE = -1;

describe('computePlayerReach', () => {
  it('should mark the whole floor as reachable when the level is flat', () => {
    const reach = computePlayerReach(FLAT);

    expect(
      every(range(WIDTH), (column) =>
        isReachableCell(reach, FLOOR_ROW, column),
      ),
    ).toBe(true);
  });

  it('should shape the map like the tiles of the level when the reach is worked out', () => {
    const reach = computePlayerReach(FLAT);

    expect(size(reach)).toBe(HEIGHT);
    expect(every(reach, (cells) => size(cells) === WIDTH)).toBe(true);
  });

  it('should reach the perch when it stands three cells above the floor', () => {
    expect(
      isReachableCell(computePlayerReach(PERCH), PERCH_ROW, PLATFORM_COLUMN),
    ).toBe(true);
  });

  it('should leave the platform stranded when it stands six cells above the floor', () => {
    const reach = computePlayerReach(TOWER);

    expect(isReachableCell(reach, TOWER_ROW, PLATFORM_COLUMN)).toBe(false);
    expect(isReachableCell(reach, FLOOR_ROW, PLATFORM_COLUMN)).toBe(true);
  });

  it('should climb the ledge when it is four cells up but not when it is five', () => {
    expect(
      isReachableCell(
        computePlayerReach(LEDGE_FOUR_UP),
        LEDGE_FOUR_ROW,
        FAR_COLUMN,
      ),
    ).toBe(true);
    expect(
      isReachableCell(
        computePlayerReach(LEDGE_FIVE_UP),
        LEDGE_FIVE_ROW,
        FAR_COLUMN,
      ),
    ).toBe(false);
  });

  it('should jump the pit when it is five columns wide but not when it is six', () => {
    expect(
      isReachableCell(computePlayerReach(PIT_FIVE_WIDE), FLOOR_ROW, FAR_COLUMN),
    ).toBe(true);
    expect(
      isReachableCell(computePlayerReach(PIT_SIX_WIDE), FLOOR_ROW, FAR_COLUMN),
    ).toBe(false);
  });

  it('should walk on when the way is barred by spikes rather than walls', () => {
    expect(
      isReachableCell(computePlayerReach(SPIKE_RUN), FLOOR_ROW, FAR_COLUMN),
    ).toBe(true);
  });

  it('should reach nothing when the entry column has no floor', () => {
    const reach = computePlayerReach(FLOATING);

    expect(
      every(reach, (cells) =>
        every(cells, (isReachable) => isReachable === false),
      ),
    ).toBe(true);
  });

  it('should call the cell unreachable when it lies outside the level', () => {
    const reach = computePlayerReach(FLAT);

    expect(isReachableCell(reach, OUTSIDE, FIRST_COLUMN)).toBe(false);
    expect(isReachableCell(reach, FIRST_ROW, OUTSIDE)).toBe(false);
    expect(isReachableCell(reach, HEIGHT, FIRST_COLUMN)).toBe(false);
    expect(isReachableCell(reach, FIRST_ROW, WIDTH)).toBe(false);
  });

  it('should leave the level it was handed untouched when the reach is worked out', () => {
    const level = createLevel(FLAT_ROWS);

    computePlayerReach(level);

    expect(level).toEqual(createLevel(FLAT_ROWS));
  });
});
