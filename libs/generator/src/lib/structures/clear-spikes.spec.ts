import {
  isSpikeTile,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { every, filter, flatten, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from '../generate';
import { clearSpikes } from './clear-spikes';

const TEETH = 300;

const FIRST_UNTOUCHED_LEVEL = 5;

/** A long floor with a tooth standing on every tile of it. */
const toothyFloor = (): Tile[][] => [
  times(TEETH, (): Tile => TILE_SPIKE),
  times(TEETH, (): Tile => TILE_DIRT),
];

const den = (): Tile[][] => [
  [TILE_AIR, TILE_SPIKE_CEILING, TILE_AIR, TILE_SPIKE_CEILING],
  [TILE_AIR, TILE_AIR, TILE_AIR, TILE_AIR],
  [TILE_SPIKE, TILE_AIR, TILE_SPIKE, TILE_AIR],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const spikesIn = (tiles: Tile[][]): { row: number; column: number }[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile }) => isSpikeTile(tile),
      ),
    ),
  );

const spikeKeys = (tiles: Tile[][]): Set<string> =>
  new Set(map(spikesIn(tiles), ({ row, column }) => `${row},${column}`));

const leftOn = (levelNumber: number): number =>
  size(spikesIn(clearSpikes(toothyFloor(), levelNumber)));

describe('clearSpikes', () => {
  it('sows nothing of its own, on any level', () => {
    const planted = spikeKeys(den());

    times(8, (index) => {
      const level = index + 1;
      const sprung = filter(
        spikesIn(clearSpikes(den(), level)),
        ({ row, column }) => !planted.has(`${row},${column}`),
      );

      expect(sprung, `level ${level} grew teeth of its own`).toEqual([]);
    });
  });

  it('sends the first level out bare, hanging teeth and all', () => {
    expect(spikesIn(clearSpikes(den(), 1))).toEqual([]);
  });

  it('pulls the share each level was promised', () => {
    expect(leftOn(1)).toBe(0);
    expect(leftOn(2)).toBe(TEETH * 0.2);
    expect(leftOn(3)).toBe(TEETH * 0.4);
    expect(leftOn(4)).toBe(TEETH * 0.7);
  });

  it('leaves every tooth standing from the fifth level on', () => {
    times(4, (index) => {
      const level = FIRST_UNTOUCHED_LEVEL + index;

      expect(clearSpikes(den(), level), `level ${level}`).toEqual(den());
      expect(leftOn(level)).toBe(TEETH);
    });
  });

  it('thins a level the same way however often it is dealt', () => {
    times(4, (index) => {
      const level = index + 1;

      expect(clearSpikes(toothyFloor(), level)).toEqual(
        clearSpikes(toothyFloor(), level),
      );
    });
  });

  it('leaves an air tile where it pulled a tooth, and nothing else touched', () => {
    const thinned = clearSpikes(den(), 1);

    expect(every(flatten(thinned), (tile) => !isSpikeTile(tile))).toBe(true);
    expect(thinned[1]).toEqual([TILE_AIR, TILE_AIR, TILE_AIR, TILE_AIR]);
    expect(thinned[3]).toEqual([TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT]);
    expect(thinned[0]).toEqual([TILE_AIR, TILE_AIR, TILE_AIR, TILE_AIR]);
  });

  it('hands back a grid of its own rather than the one it was given', () => {
    const tiles = den();

    clearSpikes(tiles, 1);
    clearSpikes(tiles, FIRST_UNTOUCHED_LEVEL);

    expect(tiles).toEqual(den());
  });

  it('sends the first level of a dealt day out bare', () => {
    const world = generate(new Date(Date.UTC(2026, 7, 2)));

    expect(spikesIn(world.levels[0].tiles)).toEqual([]);
  });
});
