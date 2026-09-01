import { isSolidTile, TILE_AIR } from '@mander/model';
import { every, filter, includes, map, range, size } from 'lodash-es';

import { STRUCTURE_HEIGHT, STRUCTURE_WIDTH } from './consts';
import { STRUCTURE_END, STRUCTURE_START } from './special-tiles';

type Grid = readonly (readonly number[])[];

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

export const VERTICAL_SHAFT_ROWS: readonly number[] = Object.freeze([0, 1]);

export const VERTICAL_EXIT_ROW = 2;

export const VERTICAL_EXIT_COLUMNS: readonly number[] = Object.freeze(
  range(6, 14),
);

export const VERTICAL_HALL_ROWS: readonly number[] = Object.freeze([17, 18]);

export const VERTICAL_FLOOR_ROW = STRUCTURE_HEIGHT - 1;

export const VERTICAL_ENTRY_COLUMNS: readonly number[] = Object.freeze(
  range(8, 12),
);

const spanOf = (columns: readonly number[]): string =>
  `${columns[0]}-${columns[size(columns) - 1]}`;

const isEmpty = (cell: number): boolean =>
  cell === TILE_AIR || includes(MARKERS, cell);

const areEmpty = (structure: Grid, rows: readonly number[]): boolean =>
  every(rows, (row) => every(structure[row], isEmpty));

const isExitLaid = (structure: Grid): boolean =>
  every(VERTICAL_EXIT_COLUMNS, (column) =>
    isSolidTile(structure[VERTICAL_EXIT_ROW]?.[column] ?? TILE_AIR),
  );

const isFloorLaid = (structure: Grid): boolean =>
  every(
    range(STRUCTURE_WIDTH),
    (column) =>
      isSolidTile(structure[VERTICAL_FLOOR_ROW]?.[column] ?? TILE_AIR) !==
      includes(VERTICAL_ENTRY_COLUMNS, column),
  );

interface Rule {
  message: string;
  isKept: (structure: Grid) => boolean;
}

const RULES: readonly Rule[] = Object.freeze([
  {
    message: `rows ${VERTICAL_SHAFT_ROWS.join(' and ')} are the shaft the player leaves through and must be empty`,
    isKept: (structure: Grid) => areEmpty(structure, VERTICAL_SHAFT_ROWS),
  },
  {
    message: `row ${VERTICAL_EXIT_ROW} must carry the exit platform, solid across columns ${spanOf(VERTICAL_EXIT_COLUMNS)}`,
    isKept: isExitLaid,
  },
  {
    message: `rows ${VERTICAL_HALL_ROWS.join(' and ')} are the hall the player arrives in and must be empty`,
    isKept: (structure: Grid) => areEmpty(structure, VERTICAL_HALL_ROWS),
  },
  {
    message: `row ${VERTICAL_FLOOR_ROW} must be a solid floor but for the entry gap at columns ${spanOf(VERTICAL_ENTRY_COLUMNS)}`,
    isKept: isFloorLaid,
  },
]);

export const verticalIssues = (structure: Grid): string[] =>
  map(
    filter(RULES, (rule) => !rule.isKept(structure)),
    (rule) => rule.message,
  );
