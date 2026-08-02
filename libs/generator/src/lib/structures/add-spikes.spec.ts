import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { every, filter, flatten, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from '../generate';
import { addSpikes } from './add-spikes';

/** Past the levels walked bare or thinned, so the rules all run in full. */
const GROWN_LEVEL = 8;

/** The air the player needs over a spike to have a jump that clears it. */
const HEADROOM = 3;

const WIDTH = 12;
const HEIGHT = 12;

const blank = (): Tile[][] =>
  times(HEIGHT, () => times(WIDTH, (): Tile => TILE_AIR));

const fillRow = (tiles: Tile[][], row: number, tile: Tile): void => {
  tiles[row] = times(WIDTH, () => tile);
};

const spikesIn = (tiles: Tile[][]): { row: number; column: number }[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile }) => tile === TILE_SPIKE,
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

describe('addSpikes', () => {
  it('leaves every spike it sows a full jump of air over its head', () => {
    const tiles = blank();
    fillRow(tiles, HEIGHT - 1, TILE_DIRT);

    const laid = addSpikes(tiles, GROWN_LEVEL);
    const spikes = spikesIn(laid);

    expect(size(spikes)).toBeGreaterThan(0);
    expect(
      every(
        spikes,
        ({ row, column }) => airAbove(laid, row, column) === HEADROOM,
      ),
    ).toBe(true);
  });

  it('sows no spike into a corridor too low to jump through', () => {
    const tiles = blank();
    fillRow(tiles, 8, TILE_DIRT);
    fillRow(tiles, 4, TILE_DIRT);

    // Rows 5, 6 and 7 are open, so a spike on the corridor floor would leave
    // two. The open sky over the slab at row 4 is another matter, and keeps
    // its spikes.
    const laid = addSpikes(tiles, GROWN_LEVEL);

    expect(filter(spikesIn(laid), ({ row }) => row === 7)).toEqual([]);
    expect(
      size(filter(spikesIn(laid), ({ row }) => row === 3)),
    ).toBeGreaterThan(0);
  });

  it('pulls out a spike a structure left under a low ceiling', () => {
    const tiles = blank();
    fillRow(tiles, 8, TILE_DIRT);
    fillRow(tiles, 4, TILE_DIRT);
    tiles[7][5] = TILE_SPIKE;

    expect(addSpikes(tiles, GROWN_LEVEL)[7][5]).toBe(TILE_AIR);
  });

  it('keeps a structure spike that already has the air over it', () => {
    const tiles = blank();
    fillRow(tiles, 8, TILE_DIRT);
    fillRow(tiles, 3, TILE_DIRT);
    tiles[7][5] = TILE_SPIKE;

    expect(addSpikes(tiles, GROWN_LEVEL)[7][5]).toBe(TILE_SPIKE);
  });

  it('reads teeth hanging overhead as ceiling, not as air', () => {
    const tiles = blank();
    fillRow(tiles, 8, TILE_DIRT);
    fillRow(tiles, 3, TILE_DIRT);
    tiles[4][5] = TILE_SPIKE_CEILING;
    tiles[7][5] = TILE_SPIKE;

    expect(addSpikes(tiles, GROWN_LEVEL)[7][5]).toBe(TILE_AIR);
  });

  it('holds the rule on the thinned levels, where nothing is sown', () => {
    const tiles = blank();
    fillRow(tiles, 8, TILE_DIRT);
    fillRow(tiles, 4, TILE_DIRT);
    tiles[7][5] = TILE_SPIKE;

    expect(addSpikes(tiles, 2)[7][5]).toBe(TILE_AIR);
  });

  it('holds the rule across a dealt day, structures and all', () => {
    const world = generate(new Date(Date.UTC(2026, 7, 2)));

    const cramped = flatten(
      map(world.levels, (level, index) =>
        map(
          filter(
            spikesIn(level.tiles),
            ({ row, column }) => airAbove(level.tiles, row, column) < HEADROOM,
          ),
          ({ row, column }) => `level ${index + 1} (${row}, ${column})`,
        ),
      ),
    );

    expect(cramped).toEqual([]);
  });
});
