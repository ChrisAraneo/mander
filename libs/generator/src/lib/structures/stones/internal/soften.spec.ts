import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { blur } from './blur';
import { soften } from './soften';

const SIZE = 41;

const MIDDLE = 20;

const createDot = (): number[][] =>
  times(SIZE, (row) =>
    times(SIZE, (column) => Number(row === MIDDLE && column === MIDDLE)),
  );

describe('soften', () => {
  it('should keep the field the same when all of its cells are the same', () => {
    expect(
      soften([
        [1, 1],
        [1, 1],
      ]),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('should blur the field twice when it softens it', () => {
    expect(soften(createDot())).toEqual(blur(blur(createDot())));
  });

  it('should reach farther than one blur when it softens a lone cell', () => {
    expect(blur(createDot())[MIDDLE][MIDDLE + 12]).toBe(0);
    expect(soften(createDot())[MIDDLE][MIDDLE + 12]).toBeGreaterThan(0);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(soften([])).toEqual([]);
  });
});
