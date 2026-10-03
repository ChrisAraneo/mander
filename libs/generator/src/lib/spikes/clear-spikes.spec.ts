import {
  isSpikeTile,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import {
  every,
  filter,
  flatten,
  includes,
  map,
  range,
  size,
  times,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../consts';
import { generate } from '../generate';
import { clearSpikes } from './clear-spikes';

interface Cell {
  row: number;
  column: number;
}

const SEED = 'DAY-1';

const TEETH = 300;

const FIRST_UNTOUCHED_LEVEL = 5;

const createToothyFloor = (): Tile[][] => [
  times(TEETH, (): Tile => TILE_SPIKE),
  times(TEETH, (): Tile => TILE_DIRT),
];

const createDen = (): Tile[][] => [
  [TILE_AIR, TILE_SPIKE_CEILING, TILE_AIR, TILE_SPIKE_CEILING],
  [TILE_AIR, TILE_AIR, TILE_AIR, TILE_AIR],
  [TILE_SPIKE, TILE_AIR, TILE_SPIKE, TILE_AIR],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const findSpikes = (tiles: Tile[][]): Cell[] =>
  flatten(
    map(tiles, (cells, row) =>
      map(
        filter(range(size(cells)), (column) => isSpikeTile(cells[column])),
        (column) => ({ row, column }),
      ),
    ),
  );

const formatSpikeKeys = (tiles: Tile[][]): string[] =>
  map(findSpikes(tiles), ({ row, column }) => `${row},${column}`);

const countSpikesLeft = (levelNumber: number): number =>
  size(
    findSpikes(
      clearSpikes(createToothyFloor(), levelNumber, createRandom(SEED)),
    ),
  );

describe('clearSpikes', () => {
  it('should sow no teeth of its own when it thins any level', () => {
    const planted = formatSpikeKeys(createDen());

    times(LEVELS_PER_DAY, (index) => {
      const levelNumber = index + 1;
      const sprung = filter(
        formatSpikeKeys(
          clearSpikes(createDen(), levelNumber, createRandom(SEED)),
        ),
        (key) => !includes(planted, key),
      );

      expect(sprung, `level ${levelNumber} grew teeth of its own`).toEqual([]);
    });
  });

  it('should send the level out bare, hanging teeth and all, when it is the first', () => {
    expect(findSpikes(clearSpikes(createDen(), 1, createRandom(SEED)))).toEqual(
      [],
    );
  });

  it('should pull the share the level was promised when it thins one', () => {
    expect(countSpikesLeft(1)).toBe(0);
    expect(countSpikesLeft(2)).toBe(TEETH * 0.2);
    expect(countSpikesLeft(3)).toBe(TEETH * 0.4);
    expect(countSpikesLeft(4)).toBe(TEETH * 0.7);
  });

  it('should leave every tooth standing when the level is the fifth or later', () => {
    times(4, (index) => {
      const levelNumber = FIRST_UNTOUCHED_LEVEL + index;

      expect(
        clearSpikes(createDen(), levelNumber, createRandom(SEED)),
        `level ${levelNumber}`,
      ).toEqual(createDen());
      expect(countSpikesLeft(levelNumber)).toBe(TEETH);
    });
  });

  it('should thin the level the same way when the generator starts from the same seed', () => {
    times(4, (index) => {
      const levelNumber = index + 1;

      expect(
        clearSpikes(createToothyFloor(), levelNumber, createRandom(SEED)),
      ).toEqual(
        clearSpikes(createToothyFloor(), levelNumber, createRandom(SEED)),
      );
    });
  });

  it('should thin the level another way when the generator starts from another seed', () => {
    expect(
      clearSpikes(createToothyFloor(), 2, createRandom('DAY-1'))[0],
    ).not.toEqual(
      clearSpikes(createToothyFloor(), 2, createRandom('DAY-2'))[0],
    );
  });

  it('should leave an air tile behind and nothing else touched when it pulls a tooth', () => {
    const thinned = clearSpikes(createDen(), 1, createRandom(SEED));

    expect(every(flatten(thinned), (tile) => !isSpikeTile(tile))).toBe(true);
    expect(thinned[1]).toEqual([TILE_AIR, TILE_AIR, TILE_AIR, TILE_AIR]);
    expect(thinned[3]).toEqual([TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT]);
    expect(thinned[0]).toEqual([TILE_AIR, TILE_AIR, TILE_AIR, TILE_AIR]);
  });

  it('should send the level out bare when it is the first of a dealt day', () => {
    const world = generate(new Date(Date.UTC(2026, 7, 2)));

    expect(findSpikes(world.levels[0].tiles)).toEqual([]);
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(clearSpikes([], 1, createRandom(SEED))).toEqual([]);
  });

  it('should not change the old grid when it thins the spikes', () => {
    const tiles = createDen();

    clearSpikes(tiles, 1, createRandom(SEED));
    clearSpikes(tiles, FIRST_UNTOUCHED_LEVEL, createRandom(SEED));

    expect(tiles).toEqual(createDen());
  });
});
