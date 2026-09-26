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

import { addPadding } from './padding/add-padding';
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
  it('should keep the hazard and the wall behind it in the same cell when both are painted there', () => {
    expect(joined().tiles[LEDGE_ROW][TRAP_COLUMN]).toBe(TILE_BEARTRAP);
    expect(joined().backTiles[LEDGE_ROW][TRAP_COLUMN]).toBe(TILE_BRICK);
  });

  it('should keep the spike in front of the wall when both are painted in the same cell', () => {
    expect(joined().tiles[LEDGE_ROW][TRAP_COLUMN + 2]).toBe(TILE_SPIKE);
    expect(joined().backTiles[LEDGE_ROW][TRAP_COLUMN + 2]).toBe(TILE_BRICK);
  });

  it('should leave the front layer empty when only the back was painted', () => {
    expect(joined().tiles[0][TRAP_COLUMN]).toBe(TILE_AIR);
    expect(joined().backTiles[0][TRAP_COLUMN]).toBe(TILE_BRICK);
  });

  it('should leave the back layer empty when only the front was painted', () => {
    expect(joined().tiles[GROUND_ROW][TRAP_COLUMN]).toBe(TILE_DIRT);
    expect(joined().backTiles[GROUND_ROW][TRAP_COLUMN]).toBe(TILE_AIR);
  });

  it('should lay the markers into neither layer when the sector carries a start and an end', () => {
    expect(joined().tiles[LEDGE_ROW][0]).toBe(TILE_AIR);
    expect(joined().backTiles[LEDGE_ROW][0]).toBe(TILE_BRICK);
  });

  it('should join both layers to the same shape when it joins the sectors', () => {
    const { tiles, backTiles } = joined();

    expect(map(backTiles, (row) => row.length)).toEqual(
      map(tiles, (row) => row.length),
    );
  });

  it('should carry both layers through as one shape when the level is padded', () => {
    const { tiles, backTiles } = joined();

    expect(map(addPadding(backTiles, tiles), (row) => row.length)).toEqual(
      map(addPadding(tiles), (row) => row.length),
    );
  });

  it('should turn the back layer with the front when the level is mirrored', () => {
    const { tiles, backTiles } = joined();
    const width = tiles[0].length;

    expect(mirrorTiles(backTiles)[0][width - 1 - TRAP_COLUMN]).toBe(TILE_BRICK);
  });
});
