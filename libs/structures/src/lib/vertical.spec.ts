import { every, filter, flatten, map, size, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_WIDTH } from './consts';
import { VERTICAL_STRUCTURES } from './library';
import { STRUCTURE_END, STRUCTURE_START } from './special-tiles';
import { frontOf } from './layers';
import type { VerticalStructure } from './structure';
import { VERTICAL_HEIGHT, verticalIssues } from './vertical-shape';

const named = (index: number): string =>
  `VERTICAL_${String(index + 1).padStart(3, '0')}`;

const countOf = (structure: VerticalStructure, tile: number): number =>
  size(filter(flatten(frontOf(structure)), (cell) => cell === tile));

describe('VERTICAL_STRUCTURES', () => {
  it('gives the generator sectors to stack', () => {
    expect(size(VERTICAL_STRUCTURES)).toBeGreaterThan(0);
  });

  it('holds every sector to the shape the stack is joined by', () => {
    const broken = flatten(
      map(VERTICAL_STRUCTURES, (structure, index) =>
        map(
          verticalIssues(frontOf(structure)),
          (issue) => `${named(index)}: ${issue}`,
        ),
      ),
    );

    expect(broken).toEqual([]);
  });

  it('cuts every sector to the size of a vertical structure', () => {
    const ragged = filter(
      map(VERTICAL_STRUCTURES, (structure, index) => ({
        name: named(index),
        structure,
      })),
      ({ structure }) =>
        size(frontOf(structure)) !== VERTICAL_HEIGHT ||
        !every(frontOf(structure), (row) => size(row) === STRUCTURE_WIDTH),
    );

    expect(map(ragged, ({ name }) => name)).toEqual([]);
  });

  it('marks where the player comes in and where it leaves', () => {
    const unmarked = filter(
      map(VERTICAL_STRUCTURES, (structure, index) => ({
        name: named(index),
        structure,
      })),
      ({ structure }) =>
        countOf(structure, STRUCTURE_START) !== 1 ||
        countOf(structure, STRUCTURE_END) !== 1,
    );

    expect(map(unmarked, ({ name }) => name)).toEqual([]);
  });

  it('builds no two sectors the same', () => {
    const prints = map(VERTICAL_STRUCTURES, (structure) =>
      JSON.stringify(structure),
    );

    expect(size(uniq(prints))).toBe(size(VERTICAL_STRUCTURES));
  });
});
