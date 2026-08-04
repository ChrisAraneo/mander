import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { every, filter, flatten, map, range, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from '../generate';
import { computeWorldName } from '../seed/compute-world-name';
import { addPadding } from './add-padding';
import { addPlayerSpawn } from './add-player-spawn';
import { addPortal } from './add-portal';
import { addSpikes } from './add-spikes';
import { joinStructures } from './join-structures';
import { pickStructures } from './pick-structures';

const GROWN_LEVEL = 8;

const HEADROOM = 3;
const LEAP_HEADROOM = HEADROOM + 1;
const MAX_RUN = 2;
const STRUCTURES_PER_LEVEL = 7;
const NORMAL_LEVELS = 6;

const WIDTH = 12;
const HEIGHT = 12;

const blank = (): Tile[][] =>
  times(HEIGHT, () => times(WIDTH, (): Tile => TILE_AIR));

const fillRow = (tiles: Tile[][], row: number, tile: Tile): void => {
  tiles[row] = times(WIDTH, () => tile);
};

const flatGround = (): Tile[][] => {
  const tiles = blank();
  fillRow(tiles, HEIGHT - 1, TILE_DIRT);

  return tiles;
};

const longGround = (): Tile[][] =>
  times(HEIGHT, (row) =>
    times(300, (): Tile => (row === HEIGHT - 1 ? TILE_DIRT : TILE_AIR)),
  );

const spikesIn = (tiles: Tile[][]): { row: number; column: number }[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile }) => tile === TILE_SPIKE,
      ),
    ),
  );

const runLengths = (tiles: Tile[][]): number[] =>
  flatten(
    map(tiles, (cells) =>
      filter(
        map(
          cells.reduce((runs: number[][], tile, column) => {
            if (tile !== TILE_SPIKE) return runs;
            const open = runs[runs.length - 1];
            if (open && open[open.length - 1] === column - 1) open.push(column);
            else runs.push([column]);

            return runs;
          }, []),
          size,
        ),
        (length) => length > 0,
      ),
    ),
  );

const airAbove = (tiles: Tile[][], row: number, column: number): number =>
  size(
    filter(
      times(HEADROOM, (up) => tiles[row - 1 - up]?.[column] ?? TILE_AIR),
      (tile) => tile === TILE_AIR,
    ),
  );

const hasLeapRoom = (tiles: Tile[][], row: number, column: number): boolean =>
  every(
    range(1, LEAP_HEADROOM + 1),
    (up) => (tiles[row - up]?.[column] ?? TILE_AIR) === TILE_AIR,
  );

const cappedPairs = (tiles: Tile[][]): { row: number; column: number }[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile, column }) =>
          tile === TILE_SPIKE &&
          cells[column - 1] === TILE_SPIKE &&
          !(
            hasLeapRoom(tiles, row, column) &&
            hasLeapRoom(tiles, row, column - 1)
          ),
      ),
    ),
  );

const spikeKeys = (tiles: Tile[][]): Set<string> =>
  new Set(map(spikesIn(tiles), ({ row, column }) => `${row},${column}`));

describe('addSpikes', () => {
  it('leaves every spike it sows a full jump of air over its head', () => {
    const laid = addSpikes(flatGround(), GROWN_LEVEL);
    const spikes = spikesIn(laid);

    expect(size(spikes)).toBeGreaterThan(0);
    expect(
      every(
        spikes,
        ({ row, column }) => airAbove(laid, row, column) === HEADROOM,
      ),
    ).toBe(true);
  });

  it('never sows a row of teeth longer than a player can leap', () => {
    const laid = addSpikes(flatGround(), GROWN_LEVEL);

    expect(size(runLengths(laid))).toBeGreaterThan(0);
    expect(filter(runLengths(laid), (length) => length > MAX_RUN)).toEqual([]);
  });

  it('sows no spike into a corridor too low to jump through', () => {
    const tiles = blank();
    fillRow(tiles, 8, TILE_DIRT);
    fillRow(tiles, 4, TILE_DIRT);

    const laid = addSpikes(tiles, GROWN_LEVEL);

    expect(filter(spikesIn(laid), ({ row }) => row === 7)).toEqual([]);
    expect(
      size(filter(spikesIn(laid), ({ row }) => row === 3)),
    ).toBeGreaterThan(0);
  });

  it('sows nothing under teeth hanging overhead, reading them as ceiling', () => {
    const tiles = blank();
    fillRow(tiles, 8, TILE_DIRT);
    fillRow(tiles, 3, TILE_DIRT);
    tiles[4][5] = TILE_SPIKE_CEILING;

    const laid = addSpikes(tiles, GROWN_LEVEL);

    expect(laid[7][5]).toBe(TILE_AIR);
    expect(laid[4][5], 'and the hanging teeth stay put').toBe(
      TILE_SPIKE_CEILING,
    );
  });

  describe('teeth under a ceiling', () => {
    const PLATFORM_ROW = 9;
    const SPIKE_ROW = PLATFORM_ROW - 1;
    const PLATFORM = [4, 5, 6, 7];
    const INNER = [5, 6];

    const underCeiling = (ceilingRow: number): Tile[][] => {
      const tiles = blank();
      fillRow(tiles, ceilingRow, TILE_DIRT);
      PLATFORM.forEach((column) => {
        tiles[PLATFORM_ROW][column] = TILE_DIRT;
      });

      return tiles;
    };

    const teethOn = (tiles: Tile[][]): number[] =>
      filter(INNER, (column) => tiles[SPIKE_ROW][column] === TILE_SPIKE);

    it('leaves a gap when the roof is too low to leap a pair', () => {
      const laid = addSpikes(
        underCeiling(SPIKE_ROW - HEADROOM - 1),
        GROWN_LEVEL,
      );

      expect(size(teethOn(laid))).toBeLessThan(2);
    });

    it('allows the pair once the roof lifts by a block', () => {
      const laid = addSpikes(
        underCeiling(SPIKE_ROW - HEADROOM - 2),
        GROWN_LEVEL,
      );

      expect(teethOn(laid)).toEqual(INNER);
    });

    it('still lets the structure have its own pair under a low roof', () => {
      const tiles = underCeiling(SPIKE_ROW - HEADROOM - 1);
      INNER.forEach((column) => {
        tiles[SPIKE_ROW][column] = TILE_SPIKE;
      });

      expect(teethOn(addSpikes(tiles, GROWN_LEVEL))).toEqual(INNER);
    });

    it('drops the sown tooth beside one the structure planted', () => {
      const tiles = underCeiling(SPIKE_ROW - HEADROOM - 1);
      tiles[SPIKE_ROW][INNER[0]] = TILE_SPIKE;

      expect(teethOn(addSpikes(tiles, GROWN_LEVEL))).toEqual([INNER[0]]);
    });

    it('sows no such pair into any level a real day deals out', () => {
      const leaked = flatten(
        map(
          times(12, (day) => new Date(Date.UTC(2026, 7, 1 + day))),
          (date) =>
            flatten(
              map(
                times(NORMAL_LEVELS, (index) => index),
                (index) => {
                  const preSpike = addPadding(
                    addPortal(
                      addPlayerSpawn(
                        joinStructures(
                          pickStructures(
                            computeWorldName(date),
                            NORMAL_LEVELS * STRUCTURES_PER_LEVEL,
                            'normal',
                          ).slice(
                            index * STRUCTURES_PER_LEVEL,
                            (index + 1) * STRUCTURES_PER_LEVEL,
                          ),
                        ),
                      ),
                    ),
                  );
                  const planted = spikeKeys(preSpike);

                  return filter(
                    cappedPairs(addSpikes(preSpike, index + 1)),
                    ({ row, column }) =>
                      !planted.has(`${row},${column}`) ||
                      !planted.has(`${row},${column - 1}`),
                  );
                },
              ),
            ),
        ),
      );

      expect(leaked).toEqual([]);
    });
  });

  describe('spikes the structures themselves laid down', () => {
    it('keeps one left under a ceiling too low to jump through', () => {
      const tiles = blank();
      fillRow(tiles, 8, TILE_DIRT);
      fillRow(tiles, 4, TILE_DIRT);
      tiles[7][5] = TILE_SPIKE;

      expect(addSpikes(tiles, GROWN_LEVEL)[7][5]).toBe(TILE_SPIKE);
    });

    it('keeps one with the air over it', () => {
      const tiles = blank();
      fillRow(tiles, 8, TILE_DIRT);
      fillRow(tiles, 3, TILE_DIRT);
      tiles[7][5] = TILE_SPIKE;

      expect(addSpikes(tiles, GROWN_LEVEL)[7][5]).toBe(TILE_SPIKE);
    });

    it('keeps one hung out on a ledge', () => {
      const tiles = blank();
      tiles[8][5] = TILE_DIRT;
      tiles[7][5] = TILE_SPIKE;

      expect(addSpikes(tiles, GROWN_LEVEL)[7][5]).toBe(TILE_SPIKE);
    });

    it('keeps a long row of them whole, however far it runs', () => {
      const tiles = blank();
      fillRow(tiles, 8, TILE_DIRT);
      fillRow(tiles, 4, TILE_DIRT);
      times(6, (offset) => {
        tiles[7][3 + offset] = TILE_SPIKE;
      });

      const laid = addSpikes(tiles, GROWN_LEVEL);

      expect(
        map(
          times(6, (offset) => laid[7][3 + offset]),
          (tile) => tile,
        ),
      ).toEqual(times(6, () => TILE_SPIKE));
    });

    it('keeps them on the thinned levels too, where little is sown', () => {
      const tiles = blank();
      fillRow(tiles, 8, TILE_DIRT);
      fillRow(tiles, 4, TILE_DIRT);
      tiles[7][5] = TILE_SPIKE;

      expect(addSpikes(tiles, 2)[7][5]).toBe(TILE_SPIKE);
    });
  });

  describe('the difficulty ramp', () => {
    const sownOn = (levelNumber: number): number =>
      size(spikesIn(addSpikes(longGround(), levelNumber)));

    it('lays no spike at all on the first level', () => {
      const tiles = flatGround();
      tiles[HEIGHT - 2][5] = TILE_SPIKE;

      expect(spikesIn(addSpikes(tiles, 1))).toEqual([]);
    });

    it('thickens the teeth level by level up to the full crop', () => {
      const full = sownOn(6);

      expect(sownOn(2)).toBeLessThan(sownOn(3));
      expect(sownOn(3)).toBeLessThan(sownOn(4));
      expect(sownOn(4)).toBeLessThan(sownOn(5));
      expect(sownOn(5)).toBeLessThan(full);
    });

    it('holds nothing back on the last three levels', () => {
      expect(sownOn(7)).toBe(sownOn(6));
      expect(sownOn(8)).toBe(sownOn(6));
    });

    it('crops each level to about the share it was promised', () => {
      const full = sownOn(6);
      const share = (levelNumber: number): number => sownOn(levelNumber) / full;

      expect(share(2)).toBeCloseTo(0.4, 1);
      expect(share(3)).toBeCloseTo(0.6, 1);
      expect(share(4)).toBeCloseTo(0.7, 1);
      expect(share(5)).toBeCloseTo(0.8, 1);
    });
  });

  it('sends the first level of a dealt day out bare', () => {
    const world = generate(new Date(Date.UTC(2026, 7, 2)));

    expect(spikesIn(world.levels[0].tiles)).toEqual([]);
  });

  it('arms every level after the first, whichever day is dealt', () => {
    const bare = flatten(
      map(
        times(20, (day) => new Date(Date.UTC(2026, 7, 2 + day))),
        (day) =>
          filter(
            map(generate(day).levels, (level, index) => ({
              index,
              spikes: size(spikesIn(level.tiles)),
            })),
            ({ index, spikes }) => index > 0 && spikes === 0,
          ),
      ),
    );

    expect(bare).toEqual([]);
  });
});
