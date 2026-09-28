import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { blur } from './blur';
import { soften } from './soften';

const SIZE = 41;

const MIDDLE = 20;

const dot = () =>
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

  it('should blur the field twice', () => {
    expect(soften(dot())).toEqual(blur(blur(dot())));
  });

  it('should reach farther than one blur does', () => {
    expect(blur(dot())[MIDDLE][MIDDLE + 12]).toBe(0);
    expect(soften(dot())[MIDDLE][MIDDLE + 12]).toBeGreaterThan(0);
  });
});
