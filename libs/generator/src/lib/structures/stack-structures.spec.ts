import { isSolidTile, TILE_AIR, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_HEIGHT,
  STRUCTURE_WIDTH,
  STRUCTURE_END,
  STRUCTURE_START,
  VERTICAL_ENTRY_COLUMNS,
  VERTICAL_FLOOR_ROW,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import {
  every,
  flatten,
  includes,
  last,
  map,
  range,
  size,
  take,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { stackStructures } from './stack-structures';

const sectors = take([...VERTICAL_STRUCTURES], 3);

const stacked = stackStructures(sectors);

const CLIMBED_ROWS = range(2, VERTICAL_FLOOR_ROW);

const floorRow = (band: number): number =>
  size(stacked) - band * STRUCTURE_HEIGHT - 1;

const bandRows = (band: number): number[] =>
  map(CLIMBED_ROWS, (row) => floorRow(band) - VERTICAL_FLOOR_ROW + row);

describe('stackStructures', () => {
  it('gives back nothing when it is given nothing to stack', () => {
    expect(stackStructures([])).toEqual([]);
  });

  it('keeps the level as wide as a single sector', () => {
    expect(every(stacked, (row) => size(row) === STRUCTURE_WIDTH)).toBe(true);
  });

  it('makes the level as tall as the sectors put together', () => {
    expect(size(stacked)).toBe(size(sectors) * STRUCTURE_HEIGHT);
  });

  it('stands the first sector at the bottom of the climb', () => {
    expect(map(bandRows(0), (row) => stacked[row])).toEqual(
      map(CLIMBED_ROWS, (row) => sectors[0][row]),
    );
  });

  it('stands the last sector at the top of the climb', () => {
    expect(map(bandRows(size(sectors) - 1), (row) => stacked[row])).toEqual(
      map(CLIMBED_ROWS, (row) => sectors[size(sectors) - 1][row]),
    );
  });

  it('leaves no start or end marker in the tiles it lays', () => {
    const markers = [STRUCTURE_START, STRUCTURE_END];

    expect(every(flatten(stacked), (tile) => !includes(markers, tile))).toBe(
      true,
    );
  });

  it('seals the entry gap of the sector it stands on the ground', () => {
    expect(
      map(VERTICAL_ENTRY_COLUMNS, (column) => stacked[floorRow(0)][column]),
    ).toEqual(map(VERTICAL_ENTRY_COLUMNS, () => TILE_DIRT));
  });

  it('leaves the way up through every seam above the ground open', () => {
    const open = map([1, 2], (band) =>
      every(
        VERTICAL_ENTRY_COLUMNS,
        (column) => stacked[floorRow(band)][column] === TILE_AIR,
      ),
    );

    expect(open).toEqual([true, true]);
  });

  it('lays a floor the player cannot fall through', () => {
    expect(every(last(stacked) ?? [], isSolidTile)).toBe(true);
  });
});
