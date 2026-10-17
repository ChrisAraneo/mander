import { describe, expect, it } from 'vitest';

import { isReachableCell } from './is-reachable-cell';
import type { ReachMap } from './types/reach-map';

const REACH: ReachMap = [
  [true, false, false],
  [false, true, true],
];

describe('isReachableCell', () => {
  it('should give the reach of the cell when the cell lies inside the map', () => {
    const cells = [
      isReachableCell(REACH, 0, 0),
      isReachableCell(REACH, 0, 1),
      isReachableCell(REACH, 1, 0),
      isReachableCell(REACH, 1, 2),
    ];

    expect(cells).toEqual([true, false, false, true]);
  });

  it('should call the cell unreachable when the row or column is negative', () => {
    const cells = [
      isReachableCell(REACH, -1, 0),
      isReachableCell(REACH, 0, -1),
      isReachableCell(REACH, -1, -1),
    ];

    expect(cells).toEqual([false, false, false]);
  });

  it('should call the cell unreachable when the cell lies beyond the map', () => {
    const cells = [
      isReachableCell(REACH, 2, 0),
      isReachableCell(REACH, 1, 3),
      isReachableCell(REACH, 5, 5),
    ];

    expect(cells).toEqual([false, false, false]);
  });

  it('should call the cell unreachable when the map is empty', () => {
    const isReachable = isReachableCell([], 0, 0);

    expect(isReachable).toBe(false);
  });
});
