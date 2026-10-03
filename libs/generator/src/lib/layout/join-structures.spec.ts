import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
} from '@mander/model';
import {
  getFront,
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
  VERTICAL_AIR_GAP,
  VERTICAL_ARRIVAL_ROWS,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_END_ROW,
  VERTICAL_HEIGHT,
  VERTICAL_IGNORED_ROWS,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_START_ROW,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import {
  every,
  find,
  flatten,
  includes,
  join,
  map,
  max,
  range,
  size,
  some,
  split,
  take,
  takeRight,
  times,
} from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { VERTICAL_GROUND_DEPTH } from '../consts';
import type { TilePatch } from '../types/tile-patch';
import { joinStructures } from './join-structures';

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

const GROUND: TilePatch[] = map(range(STRUCTURE_WIDTH), (column) => ({
  row: STRUCTURE_HEIGHT - 1,
  column,
  tile: TILE_DIRT,
}));

const createSector = (marks: TilePatch[]): Sector => [
  times(STRUCTURE_HEIGHT, (row) =>
    times(
      STRUCTURE_WIDTH,
      (column) =>
        find(marks, (mark) => mark.row === row && mark.column === column)
          ?.tile ?? TILE_AIR,
    ),
  ),
  [],
];

const ENDING_SECTOR = createSector([
  ...GROUND,
  { row: 10, column: 18, tile: TILE_BRICK },
  { row: 10, column: 19, tile: STRUCTURE_END },
]);

const STARTING_SECTOR = createSector([
  ...GROUND,
  { row: 12, column: 0, tile: STRUCTURE_START },
  { row: 12, column: 1, tile: TILE_BRICK },
]);

const SECTORS: Sector[] = take([...VERTICAL_STRUCTURES], 3);

const STACKED = joinStructures(SECTORS, 'VERTICAL').tiles;

const BAND_ROWS = range(VERTICAL_BAND_HEIGHT);

const findTopRow = (band: number): number =>
  size(STACKED) -
  VERTICAL_GROUND_DEPTH -
  VERTICAL_HEIGHT -
  band * VERTICAL_BAND_HEIGHT;

const findBandRows = (band: number): number[] =>
  map(BAND_ROWS, (row) => findTopRow(band) + row);

const computeAirRuns = (tiles: Tile[][]): number[] =>
  map(
    split(
      join(
        map(tiles, (cells) =>
          match(some(cells, isSolidTile))
            .with(true, () => '#')
            .otherwise(() => '.'),
        ),
        '',
      ),
      '#',
    ),
    size,
  );

const eraseMarkers = (cells: readonly number[]): number[] =>
  map(cells, (cell) =>
    match(includes(MARKERS, cell))
      .with(true, () => TILE_AIR)
      .otherwise(() => cell),
  );

describe('joinStructures', () => {
  it('should lay the structures side by side in a horizontal level when neither carries markers', () => {
    const { tiles } = joinStructures(
      [createSector(GROUND), createSector(GROUND)],
      'HORIZONTAL',
    );

    expect(size(tiles)).toBe(STRUCTURE_HEIGHT);
    expect(map(tiles, size)).toEqual(
      times(STRUCTURE_HEIGHT, () => STRUCTURE_WIDTH * 2),
    );
    expect(tiles[STRUCTURE_HEIGHT - 1]).toEqual(
      times(STRUCTURE_WIDTH * 2, () => TILE_DIRT),
    );
  });

  it('should line the start of the next structure up with the end of the last in a horizontal level when both carry markers', () => {
    const { tiles } = joinStructures(
      [ENDING_SECTOR, STARTING_SECTOR],
      'HORIZONTAL',
    );

    expect(tiles[12][18]).toBe(TILE_BRICK);
    expect(tiles[12][STRUCTURE_WIDTH + 1]).toBe(TILE_BRICK);
  });

  it('should leave the markers out of the grid in a horizontal level when the structures carry them', () => {
    const { tiles } = joinStructures(
      [ENDING_SECTOR, STARTING_SECTOR],
      'HORIZONTAL',
    );

    expect(tiles[12][19]).toBe(TILE_AIR);
    expect(tiles[12][STRUCTURE_WIDTH]).toBe(TILE_AIR);
  });

  it('should prop the higher structure up to the floor in a horizontal level when the next one hangs lower', () => {
    const { tiles } = joinStructures(
      [ENDING_SECTOR, STARTING_SECTOR],
      'HORIZONTAL',
    );

    expect(size(tiles)).toBe(STRUCTURE_HEIGHT + 2);
    expect(
      map(takeRight(tiles, 2), (cells) =>
        every(takeRight(cells, STRUCTURE_WIDTH), (tile) => tile === TILE_DIRT),
      ),
    ).toEqual([true, true]);
  });

  it('should give both layers the same shape in a horizontal level when it joins the structures', () => {
    const { tiles, backTiles } = joinStructures(
      [ENDING_SECTOR, STARTING_SECTOR],
      'HORIZONTAL',
    );

    expect(map(backTiles, size)).toEqual(map(tiles, size));
  });

  it('should give back two empty layers in a horizontal level when there are no structures', () => {
    expect(joinStructures([], 'HORIZONTAL')).toEqual({
      tiles: [],
      backTiles: [],
    });
  });

  it('should give back two empty layers in a vertical level when there are no structures', () => {
    expect(joinStructures([], 'VERTICAL')).toEqual({
      tiles: [],
      backTiles: [],
    });
  });

  it('should keep the level as wide as a single sector in a vertical level when it stacks them', () => {
    expect(every(STACKED, (row) => size(row) === STRUCTURE_WIDTH)).toBe(true);
  });

  it('should make the level as tall as the sectors it overlaps and the ground in a vertical level when it stacks them', () => {
    expect(size(STACKED)).toBe(
      (size(SECTORS) - 1) * VERTICAL_BAND_HEIGHT +
        VERTICAL_HEIGHT +
        VERTICAL_GROUND_DEPTH,
    );
  });

  it('should give both layers the same shape in a vertical level when it stacks the structures', () => {
    const { tiles, backTiles } = joinStructures(SECTORS, 'VERTICAL');

    expect(map(backTiles, size)).toEqual(map(tiles, size));
  });

  it('should stand the sector at the bottom of the climb in a vertical level when it is the first', () => {
    expect(map(findBandRows(0), (row) => STACKED[row])).toEqual(
      map(BAND_ROWS, (row) => eraseMarkers(getFront(SECTORS[0])[row])),
    );
  });

  it('should stand the sector at the top of the climb in a vertical level when it is the last', () => {
    expect(map(findBandRows(size(SECTORS) - 1), (row) => STACKED[row])).toEqual(
      map(BAND_ROWS, (row) =>
        eraseMarkers(getFront(SECTORS[size(SECTORS) - 1])[row]),
      ),
    );
  });

  it('should leave the drawing out of the climb in a vertical level when it sits below the band of a sector', () => {
    const scribbled: Sector = [
      map(getFront(SECTORS[0]), (cells, row) =>
        match(includes(VERTICAL_IGNORED_ROWS, row))
          .with(true, () => map(cells, () => TILE_CERAMIC))
          .otherwise(() => [...cells]),
      ),
      [],
    ];

    expect(
      flatten(joinStructures([scribbled], 'VERTICAL').tiles),
    ).not.toContain(TILE_CERAMIC);
  });

  it('should leave no start or end marker behind in a vertical level when it lays the tiles', () => {
    expect(every(flatten(STACKED), (tile) => !includes(MARKERS, tile))).toBe(
      true,
    );
  });

  it('should lay the ground in a vertical level when the sector at the bottom stands on it', () => {
    expect(takeRight(STACKED, VERTICAL_GROUND_DEPTH)).toEqual(
      times(VERTICAL_GROUND_DEPTH, () =>
        times(STRUCTURE_WIDTH, () => TILE_DIRT),
      ),
    );
  });

  it('should join the sectors no further apart than the player can jump in a vertical level when it stacks them', () => {
    const climb = joinStructures([...VERTICAL_STRUCTURES], 'VERTICAL').tiles;

    expect(max(computeAirRuns(climb))).toBeLessThanOrEqual(VERTICAL_AIR_GAP);
  });

  it('should lay the block a sector ends in where the next one starts in a vertical level when it seams them together', () => {
    const seams = map(range(size(SECTORS) - 1), (band) => ({
      end: findTopRow(band) + VERTICAL_END_ROW,
      start: findTopRow(band + 1) + VERTICAL_START_ROW,
    }));

    expect(map(seams, ({ end }) => end)).toEqual(
      map(seams, ({ start }) => start),
    );
    expect(
      map(seams, ({ end }) => STACKED[end][VERTICAL_MARKER_COLUMN]),
    ).toEqual(map(seams, () => TILE_AIR));
  });

  it('should leave the hall open in a vertical level when a sector is entered through it', () => {
    const halls = map(range(size(SECTORS)), (band) =>
      every(VERTICAL_ARRIVAL_ROWS, (row) =>
        every(STACKED[findTopRow(band) + row], (tile) => tile === TILE_AIR),
      ),
    );

    expect(halls).toEqual(map(range(size(SECTORS)), () => true));
  });
});
