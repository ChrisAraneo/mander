import { TILE_AIR, TILE_CERAMIC, TILE_DIRT } from '@mander/model';
import {
  STRUCTURE_WIDTH,
  STRUCTURE_END,
  STRUCTURE_START,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_IGNORED_ROWS,
  VERTICAL_START_ROWS,
  VERTICAL_STRUCTURES,
  type Structure,
} from '@mander/structures';
import {
  every,
  flatten,
  includes,
  map,
  range,
  size,
  take,
  takeRight,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GROUND_DEPTH, stackStructures } from './stack-structures';

const sectors = take([...VERTICAL_STRUCTURES], 3);

const stacked = stackStructures(sectors);

const BAND_ROWS = range(VERTICAL_BAND_HEIGHT);

const topRow = (band: number): number =>
  size(stacked) - GROUND_DEPTH - (band + 1) * VERTICAL_BAND_HEIGHT;

const bandRows = (band: number): number[] =>
  map(BAND_ROWS, (row) => topRow(band) + row);

const drawn = (cells: readonly number[]): number[] =>
  map(cells, (cell) =>
    includes([STRUCTURE_START, STRUCTURE_END], cell) ? TILE_AIR : cell,
  );

describe('stackStructures', () => {
  it('gives back nothing when it is given nothing to stack', () => {
    expect(stackStructures([])).toEqual([]);
  });

  it('keeps the level as wide as a single sector', () => {
    expect(every(stacked, (row) => size(row) === STRUCTURE_WIDTH)).toBe(true);
  });

  it('makes the level as tall as the bands of the sectors and the ground', () => {
    expect(size(stacked)).toBe(
      size(sectors) * VERTICAL_BAND_HEIGHT + GROUND_DEPTH,
    );
  });

  it('stands the first sector at the bottom of the climb', () => {
    expect(map(bandRows(0), (row) => stacked[row])).toEqual(
      map(BAND_ROWS, (row) => drawn(sectors[0][row])),
    );
  });

  it('stands the last sector at the top of the climb', () => {
    expect(map(bandRows(size(sectors) - 1), (row) => stacked[row])).toEqual(
      map(BAND_ROWS, (row) => drawn(sectors[size(sectors) - 1][row])),
    );
  });

  it('leaves what is drawn below the band of a sector out of the climb', () => {
    const scribbled = map(sectors[0], (cells, row) =>
      includes(VERTICAL_IGNORED_ROWS, row)
        ? map(cells, () => TILE_CERAMIC)
        : [...cells],
    ) as Structure;

    expect(flatten(stackStructures([scribbled]))).not.toContain(TILE_CERAMIC);
  });

  it('leaves no start or end marker in the tiles it lays', () => {
    const markers = [STRUCTURE_START, STRUCTURE_END];

    expect(every(flatten(stacked), (tile) => !includes(markers, tile))).toBe(
      true,
    );
  });

  it('lays the ground the sector at the bottom stands on', () => {
    const ground = takeRight(stacked, GROUND_DEPTH);

    expect(ground).toEqual(
      map(range(GROUND_DEPTH), () =>
        map(range(STRUCTURE_WIDTH), () => TILE_DIRT),
      ),
    );
  });

  it('leaves the hall every sector is entered through open', () => {
    const halls = map(range(size(sectors)), (band) =>
      every(VERTICAL_START_ROWS, (row) =>
        every(stacked[topRow(band) + row], (tile) => tile === TILE_AIR),
      ),
    );

    expect(halls).toEqual(map(range(size(sectors)), () => true));
  });
});
