import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { isEqual, map, some, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_END, STRUCTURE_START, STRUCTURE_WIDTH } from '../../consts';
import {
  VERTICAL_END_ROW,
  VERTICAL_HEIGHT,
  VERTICAL_LANDING_BANDS,
  VERTICAL_LANDING_ROW,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMN,
  VERTICAL_SHAFT_COLUMNS,
  VERTICAL_START_ROW,
} from '../consts';
import { isVerticalRuleMet } from './is-vertical-rule-met';

const createStructure = (solidCells: [number, number][]): number[][] =>
  times(VERTICAL_HEIGHT, (row) =>
    times(STRUCTURE_WIDTH, (column) =>
      match(
        some(solidCells, ([solidRow, solidColumn]) =>
          isEqual([solidRow, solidColumn], [row, column]),
        ),
      )
        .with(true, () => TILE_DIRT)
        .otherwise(() => TILE_AIR),
    ),
  );

const LEDGE_CELLS: [number, number][] = map(
  VERTICAL_LANDING_BANDS[0],
  (column): [number, number] => [VERTICAL_LANDING_ROW, column],
);

const createValidStructure = (): number[][] =>
  map(
    createStructure([
      ...LEDGE_CELLS,
      [VERTICAL_LAUNCH_ROW, VERTICAL_PLATFORM_COLUMN],
    ]),
    (cells, row) =>
      map(cells, (cell, column) =>
        match([row, column])
          .with([VERTICAL_END_ROW, VERTICAL_MARKER_COLUMN], () => STRUCTURE_END)
          .with(
            [VERTICAL_START_ROW, VERTICAL_MARKER_COLUMN],
            () => STRUCTURE_START,
          )
          .otherwise(() => cell),
      ),
  );

const VALID = createValidStructure();

const EMPTY = createStructure([]);

const BLOCKED = createStructure([
  [VERTICAL_END_ROW, 0],
  [VERTICAL_START_ROW, 0],
  [VERTICAL_LANDING_ROW, VERTICAL_SHAFT_COLUMNS[0]],
]);

describe('isVerticalRuleMet', () => {
  it('should meet every rule when the structure has the vertical shape', () => {
    expect(isVerticalRuleMet(VALID, 'EMPTY_END_ROW')).toBe(true);
    expect(isVerticalRuleMet(VALID, 'MARKED_END')).toBe(true);
    expect(isVerticalRuleMet(VALID, 'EMPTY_ARRIVAL_ROWS')).toBe(true);
    expect(isVerticalRuleMet(VALID, 'MARKED_START')).toBe(true);
    expect(isVerticalRuleMet(VALID, 'LAUNCH_PLATFORM')).toBe(true);
    expect(isVerticalRuleMet(VALID, 'OPEN_LANDING_SHAFT')).toBe(true);
    expect(isVerticalRuleMet(VALID, 'LANDING_LEDGE')).toBe(true);
  });

  it('should miss the marker rules when the structure has no markers', () => {
    expect(isVerticalRuleMet(EMPTY, 'MARKED_END')).toBe(false);
    expect(isVerticalRuleMet(EMPTY, 'MARKED_START')).toBe(false);
  });

  it('should miss the platform rules when the structure has no blocks', () => {
    expect(isVerticalRuleMet(EMPTY, 'LAUNCH_PLATFORM')).toBe(false);
    expect(isVerticalRuleMet(EMPTY, 'LANDING_LEDGE')).toBe(false);
  });

  it('should miss the empty row rules when blocks fill the end and arrival rows', () => {
    expect(isVerticalRuleMet(BLOCKED, 'EMPTY_END_ROW')).toBe(false);
    expect(isVerticalRuleMet(BLOCKED, 'EMPTY_ARRIVAL_ROWS')).toBe(false);
  });

  it('should miss the shaft rule when a block closes the landing shaft', () => {
    expect(isVerticalRuleMet(BLOCKED, 'OPEN_LANDING_SHAFT')).toBe(false);
  });
});
