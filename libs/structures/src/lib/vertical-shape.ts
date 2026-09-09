import { isSolidTile, TILE_AIR } from '@mander/model';
import { drop, every, filter, includes, map, range, some } from 'lodash-es';

import { STRUCTURE_END, STRUCTURE_START } from './special-tiles';

type Grid = readonly (readonly number[])[];

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

export const VERTICAL_HEIGHT = 22;

export const VERTICAL_MARKER_COLUMN = 9;

export const VERTICAL_END_ROW = 0;

export const VERTICAL_LAUNCH_ROW = 1;

export const VERTICAL_PLATFORM_COLUMN = VERTICAL_MARKER_COLUMN;

export const VERTICAL_PLATFORM_LENGTH = 1;

export const VERTICAL_PLATFORM_COLUMNS: readonly number[] = Object.freeze(
  range(
    VERTICAL_PLATFORM_COLUMN,
    VERTICAL_PLATFORM_COLUMN + VERTICAL_PLATFORM_LENGTH,
  ),
);

export const VERTICAL_START_ROW = VERTICAL_HEIGHT - 1;

export const VERTICAL_SHAFT_COLUMNS: readonly number[] = Object.freeze(
  range(8, 12),
);

export const VERTICAL_AIR_GAP = 3;

export const VERTICAL_BAND_HEIGHT = VERTICAL_HEIGHT - 1;

export const VERTICAL_LANDING_ROW =
  VERTICAL_BAND_HEIGHT + VERTICAL_LAUNCH_ROW - VERTICAL_AIR_GAP - 1;

export const VERTICAL_LANDING_BANDS: readonly (readonly number[])[] =
  Object.freeze([Object.freeze(range(3, 7)), Object.freeze(range(13, 17))]);

export const VERTICAL_HEADROOM_ROWS: readonly number[] = Object.freeze(
  range(VERTICAL_LANDING_ROW - 2, VERTICAL_LANDING_ROW),
);

export const VERTICAL_ARRIVAL_ROWS: readonly number[] = Object.freeze(
  range(VERTICAL_LANDING_ROW + 1, VERTICAL_HEIGHT),
);

export const VERTICAL_IGNORED_ROWS: readonly number[] = Object.freeze(
  range(VERTICAL_BAND_HEIGHT, VERTICAL_HEIGHT),
);

const isEmpty = (cell: number): boolean =>
  cell === TILE_AIR || includes(MARKERS, cell);

const areEmpty = (structure: Grid, rows: readonly number[]): boolean =>
  every(rows, (row) => every(structure[row], isEmpty));

const areEmptyAcross = (
  structure: Grid,
  rows: readonly number[],
  columns: readonly number[],
): boolean =>
  every(rows, (row) =>
    every(columns, (column) => isEmpty(structure[row]?.[column] ?? TILE_AIR)),
  );

const areSolidAcross = (
  structure: Grid,
  row: number,
  columns: readonly number[],
): boolean =>
  every(columns, (column) => isSolidTile(structure[row]?.[column] ?? TILE_AIR));

const isMarkerAt = (
  structure: Grid,
  marker: number,
  row: number,
  column: number,
): boolean =>
  structure[row]?.[column] === marker &&
  every(structure, (cells, at) => !includes(cells, marker) || at === row) &&
  every(structure[row], (cell, at) => cell !== marker || at === column);

const spanOf = (columns: readonly number[]): string =>
  `${columns[0]}-${columns[columns.length - 1]}`;

const platformRows = (structure: Grid): number[] =>
  filter(range(VERTICAL_LAUNCH_ROW, VERTICAL_LANDING_ROW + 1), (row) =>
    some(structure[row], isSolidTile),
  );

const areStepsWithinReach = (rows: readonly number[]): boolean =>
  every(drop(rows), (row, index) => row - rows[index] <= VERTICAL_AIR_GAP + 1);

interface Rule {
  message: string;
  isKept: (structure: Grid) => boolean;
}

const RULES: readonly Rule[] = Object.freeze([
  {
    message: `row ${VERTICAL_END_ROW} is the shaft the player leaves through and must be empty`,
    isKept: (structure: Grid) => areEmpty(structure, [VERTICAL_END_ROW]),
  },
  {
    message: `the end must be marked in row ${VERTICAL_END_ROW}, column ${VERTICAL_MARKER_COLUMN}, where the sector above is entered`,
    isKept: (structure: Grid) =>
      isMarkerAt(
        structure,
        STRUCTURE_END,
        VERTICAL_END_ROW,
        VERTICAL_MARKER_COLUMN,
      ),
  },
  {
    message: `rows ${VERTICAL_ARRIVAL_ROWS.join(', ')} are the hall the player arrives in and must be empty`,
    isKept: (structure: Grid) => areEmpty(structure, VERTICAL_ARRIVAL_ROWS),
  },
  {
    message: `the start must be marked in row ${VERTICAL_START_ROW}, column ${VERTICAL_MARKER_COLUMN}, where the sector below ends`,
    isKept: (structure: Grid) =>
      isMarkerAt(
        structure,
        STRUCTURE_START,
        VERTICAL_START_ROW,
        VERTICAL_MARKER_COLUMN,
      ),
  },
  {
    message: `row ${VERTICAL_LAUNCH_ROW} must carry a platform of at least ${VERTICAL_PLATFORM_LENGTH} block from column ${VERTICAL_PLATFORM_COLUMN}, the ledge the player leaves from`,
    isKept: (structure: Grid) =>
      areSolidAcross(structure, VERTICAL_LAUNCH_ROW, VERTICAL_PLATFORM_COLUMNS),
  },
  {
    message: `row ${VERTICAL_LANDING_ROW} must leave columns ${spanOf(VERTICAL_SHAFT_COLUMNS)} open so the sector below can be jumped out of`,
    isKept: (structure: Grid) =>
      areEmptyAcross(structure, [VERTICAL_LANDING_ROW], VERTICAL_SHAFT_COLUMNS),
  },
  {
    message: `row ${VERTICAL_LANDING_ROW} must carry the ledge the player lands on across columns ${map(VERTICAL_LANDING_BANDS, spanOf).join(' or ')}, clear of rows ${VERTICAL_HEADROOM_ROWS.join(' and ')}`,
    isKept: (structure: Grid) =>
      some(
        VERTICAL_LANDING_BANDS,
        (band) =>
          areSolidAcross(structure, VERTICAL_LANDING_ROW, band) &&
          areEmptyAcross(structure, VERTICAL_HEADROOM_ROWS, band),
      ),
  },
  {
    message: `no platform may sit more than ${VERTICAL_AIR_GAP} rows of air above the one below it, which is as high as the player jumps`,
    isKept: (structure: Grid) => areStepsWithinReach(platformRows(structure)),
  },
]);

export const verticalIssues = (structure: Grid): string[] =>
  map(
    filter(RULES, (rule) => !rule.isKept(structure)),
    (rule) => rule.message,
  );
