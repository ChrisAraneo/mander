import {
  every,
  filter,
  flatten,
  isEqual,
  map,
  padStart,
  size,
  uniqWith,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_END, STRUCTURE_START, STRUCTURE_WIDTH } from './consts';
import { getFront } from './get-front';
import { VERTICAL_STRUCTURES } from './library';
import type { VerticalStructure } from './types/vertical-structure';
import { VERTICAL_HEIGHT } from './vertical-shape/consts';
import { findVerticalIssues } from './vertical-shape/find-vertical-issues';

const formatVerticalName = (index: number): string =>
  `VERTICAL_${padStart(String(index + 1), 3, '0')}`;

const countTiles = (structure: VerticalStructure, tile: number): number =>
  size(filter(flatten(getFront(structure)), (cell) => cell === tile));

describe('VERTICAL_STRUCTURES', () => {
  it('should hold at least one structure when the library is read', () => {
    expect(size(VERTICAL_STRUCTURES)).toBeGreaterThan(0);
  });

  it('should give no shape issues when every structure is checked', () => {
    const issues = flatten(
      map(VERTICAL_STRUCTURES, (structure, index) =>
        map(
          findVerticalIssues(getFront(structure)),
          (issue) => `${formatVerticalName(index)}: ${issue}`,
        ),
      ),
    );

    expect(issues).toEqual([]);
  });

  it('should give every structure the size of a vertical structure when every structure is checked', () => {
    const wrongSize = filter(
      map(VERTICAL_STRUCTURES, (structure, index) => ({
        name: formatVerticalName(index),
        structure,
      })),
      ({ structure }) =>
        size(getFront(structure)) !== VERTICAL_HEIGHT ||
        !every(getFront(structure), (row) => size(row) === STRUCTURE_WIDTH),
    );

    expect(map(wrongSize, ({ name }) => name)).toEqual([]);
  });

  it('should mark one start and one end when every structure is checked', () => {
    const unmarked = filter(
      map(VERTICAL_STRUCTURES, (structure, index) => ({
        name: formatVerticalName(index),
        structure,
      })),
      ({ structure }) =>
        countTiles(structure, STRUCTURE_START) !== 1 ||
        countTiles(structure, STRUCTURE_END) !== 1,
    );

    expect(map(unmarked, ({ name }) => name)).toEqual([]);
  });

  it('should hold no two equal structures when every structure is checked', () => {
    expect(size(uniqWith(VERTICAL_STRUCTURES, isEqual))).toBe(
      size(VERTICAL_STRUCTURES),
    );
  });
});
