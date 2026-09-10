import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import {
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  type Sector,
} from '@mander/structures';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { paddingOf, padTiles } from './add-padding';
import { joinStructures } from './join-structures';
import { mirrorTiles } from './mirror-tiles';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;
const LEDGE_ROW = GROUND_ROW - 1;
const TRAP_COLUMN = 4;

const grid = (fill: (row: number, column: number) => number): number[][] =>
  map(range(STRUCTURE_HEIGHT), (row) =>
    times(STRUCTURE_WIDTH, (column) => fill(row, column)),
  );

// the case the single grid could not hold: a beartrap standing on the ground
// with a brick wall painted behind it
const sector = (): Sector =>
  [
    grid((row, column) => {
      if (row === GROUND_ROW) {
        return TILE_DIRT;
      }
      if (row === LEDGE_ROW && column === TRAP_COLUMN) {
        return TILE_BEARTRAP;
      }
      if (row === LEDGE_ROW && column === TRAP_COLUMN + 2) {
        return TILE_SPIKE;
      }
      if (row === LEDGE_ROW && column === 0) {
        return STRUCTURE_START;
      }
      if (row === LEDGE_ROW && column === STRUCTURE_WIDTH - 1) {
        return STRUCTURE_END;
      }

      return TILE_AIR;
    }),
    grid((row) => (row < GROUND_ROW ? TILE_BRICK : TILE_AIR)),
  ] as unknown as Sector;

const joined = () => joinStructures([sector(), sector()]);

describe('a sector painted in two layers', () => {
  it('keeps a hazard and the wall behind it in the same cell', () => {
    expect(joined().tiles[LEDGE_ROW][TRAP_COLUMN]).toBe(TILE_BEARTRAP);
    expect(joined().backTiles[LEDGE_ROW][TRAP_COLUMN]).toBe(TILE_BRICK);
  });

  it('holds a spike in front of the wall too', () => {
    expect(joined().tiles[LEDGE_ROW][TRAP_COLUMN + 2]).toBe(TILE_SPIKE);
    expect(joined().backTiles[LEDGE_ROW][TRAP_COLUMN + 2]).toBe(TILE_BRICK);
  });

  it('leaves the front layer empty where only the back was painted', () => {
    expect(joined().tiles[0][TRAP_COLUMN]).toBe(TILE_AIR);
    expect(joined().backTiles[0][TRAP_COLUMN]).toBe(TILE_BRICK);
  });

  it('leaves the back layer empty where only the front was painted', () => {
    expect(joined().tiles[GROUND_ROW][TRAP_COLUMN]).toBe(TILE_DIRT);
    expect(joined().backTiles[GROUND_ROW][TRAP_COLUMN]).toBe(TILE_AIR);
  });

  it('does not lay the start and end markers into either layer', () => {
    expect(joined().tiles[LEDGE_ROW][0]).toBe(TILE_AIR);
    expect(joined().backTiles[LEDGE_ROW][0]).toBe(TILE_BRICK);
  });

  it('joins both layers to the same shape', () => {
    const { tiles, backTiles } = joined();

    expect(map(backTiles, (row) => row.length)).toEqual(
      map(tiles, (row) => row.length),
    );
  });

  it('carries both layers through the padding as one shape', () => {
    const { tiles, backTiles } = joined();
    const padding = paddingOf(tiles);

    expect(map(padTiles(backTiles, padding), (row) => row.length)).toEqual(
      map(padTiles(tiles, padding), (row) => row.length),
    );
  });

  it('turns the back layer with the front when the level is mirrored', () => {
    const { tiles, backTiles } = joined();
    const width = tiles[0].length;

    expect(mirrorTiles(backTiles)[0][width - 1 - TRAP_COLUMN]).toBe(TILE_BRICK);
  });
});
