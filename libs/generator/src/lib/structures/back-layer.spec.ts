import {
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import {
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import { find, map, range, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { joinStructures } from './layout/join-structures';
import { mirrorTiles } from './mirror-tiles';
import { addPadding } from './padding/add-padding';
import type { TilePatch } from './types/tile-patch';

const GROUND_ROW = STRUCTURE_HEIGHT - 1;

const LEDGE_ROW = GROUND_ROW - 1;

const TRAP_COLUMN = 4;

const createLayer = (marks: TilePatch[], fill: Tile): Tile[][] =>
  times(STRUCTURE_HEIGHT, (row) =>
    times(
      STRUCTURE_WIDTH,
      (column) =>
        find(marks, (mark) => mark.row === row && mark.column === column)
          ?.tile ?? fill,
    ),
  );

const createGroundRow = (tile: Tile): TilePatch[] =>
  map(range(STRUCTURE_WIDTH), (column) => ({ row: GROUND_ROW, column, tile }));

const createSector = (): Sector => [
  createLayer(
    [
      ...createGroundRow(TILE_DIRT),
      { row: LEDGE_ROW, column: TRAP_COLUMN, tile: TILE_BEARTRAP },
      { row: LEDGE_ROW, column: TRAP_COLUMN + 2, tile: TILE_SPIKE },
      { row: LEDGE_ROW, column: 0, tile: STRUCTURE_START },
      { row: LEDGE_ROW, column: STRUCTURE_WIDTH - 1, tile: STRUCTURE_END },
    ],
    TILE_AIR,
  ),
  createLayer(createGroundRow(TILE_AIR), TILE_BRICK),
];

const joinSectors = () =>
  joinStructures([createSector(), createSector()], 'HORIZONTAL');

describe('a sector painted in two layers', () => {
  it('should keep the hazard and the wall behind it in the same cell when both are painted there', () => {
    expect(joinSectors().tiles[LEDGE_ROW][TRAP_COLUMN]).toBe(TILE_BEARTRAP);
    expect(joinSectors().backTiles[LEDGE_ROW][TRAP_COLUMN]).toBe(TILE_BRICK);
  });

  it('should keep the spike in front of the wall when both are painted in the same cell', () => {
    expect(joinSectors().tiles[LEDGE_ROW][TRAP_COLUMN + 2]).toBe(TILE_SPIKE);
    expect(joinSectors().backTiles[LEDGE_ROW][TRAP_COLUMN + 2]).toBe(
      TILE_BRICK,
    );
  });

  it('should leave the front layer empty when only the back was painted', () => {
    expect(joinSectors().tiles[0][TRAP_COLUMN]).toBe(TILE_AIR);
    expect(joinSectors().backTiles[0][TRAP_COLUMN]).toBe(TILE_BRICK);
  });

  it('should leave the back layer empty when only the front was painted', () => {
    expect(joinSectors().tiles[GROUND_ROW][TRAP_COLUMN]).toBe(TILE_DIRT);
    expect(joinSectors().backTiles[GROUND_ROW][TRAP_COLUMN]).toBe(TILE_AIR);
  });

  it('should lay the markers into neither layer when the sector carries a start and an end', () => {
    expect(joinSectors().tiles[LEDGE_ROW][0]).toBe(TILE_AIR);
    expect(joinSectors().backTiles[LEDGE_ROW][0]).toBe(TILE_BRICK);
  });

  it('should join both layers to the same shape when it joins the sectors', () => {
    const { tiles, backTiles } = joinSectors();

    expect(map(backTiles, size)).toEqual(map(tiles, size));
  });

  it('should carry both layers through as one shape when the level is padded', () => {
    const { tiles, backTiles } = joinSectors();

    expect(map(addPadding(backTiles, tiles), size)).toEqual(
      map(addPadding(tiles), size),
    );
  });

  it('should turn the back layer with the front when the level is mirrored', () => {
    const { tiles, backTiles } = joinSectors();

    expect(mirrorTiles(backTiles)[0][size(tiles[0]) - 1 - TRAP_COLUMN]).toBe(
      TILE_BRICK,
    );
  });
});
