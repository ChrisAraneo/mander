import { TILE_AIR } from '@mander/model';
import { every, filter, includes, map, range, some } from 'lodash-es';

import { STRUCTURE_HEIGHT } from './consts';
import { STRUCTURE_END, STRUCTURE_START } from './special-tiles';

type Grid = readonly (readonly number[])[];

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

export const VERTICAL_BAND_HEIGHT = 17;

export const VERTICAL_END_ROW = 0;

export const VERTICAL_START_ROWS: readonly number[] = Object.freeze([15, 16]);

export const VERTICAL_IGNORED_ROWS: readonly number[] = Object.freeze(
  range(VERTICAL_BAND_HEIGHT, STRUCTURE_HEIGHT),
);

const isEmpty = (cell: number): boolean =>
  cell === TILE_AIR || includes(MARKERS, cell);

const areEmpty = (structure: Grid, rows: readonly number[]): boolean =>
  every(rows, (row) => every(structure[row], isEmpty));

const isMarkerIn = (
  structure: Grid,
  marker: number,
  rows: readonly number[],
): boolean =>
  some(rows, (row) => includes(structure[row], marker)) &&
  every(
    structure,
    (cells, row) => !includes(cells, marker) || includes(rows, row),
  );

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
    message: `the end must be marked in row ${VERTICAL_END_ROW}`,
    isKept: (structure: Grid) =>
      isMarkerIn(structure, STRUCTURE_END, [VERTICAL_END_ROW]),
  },
  {
    message: `rows ${VERTICAL_START_ROWS.join(' and ')} are the hall the player arrives in and must be empty`,
    isKept: (structure: Grid) => areEmpty(structure, VERTICAL_START_ROWS),
  },
  {
    message: `the start must be marked in row ${VERTICAL_START_ROWS.join(' or ')}`,
    isKept: (structure: Grid) =>
      isMarkerIn(structure, STRUCTURE_START, VERTICAL_START_ROWS),
  },
]);

export const verticalIssues = (structure: Grid): string[] =>
  map(
    filter(RULES, (rule) => !rule.isKept(structure)),
    (rule) => rule.message,
  );
