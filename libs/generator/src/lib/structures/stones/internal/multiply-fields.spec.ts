import { describe, expect, it } from 'vitest';

import { multiplyFields } from './multiply-fields';

describe('multiplyFields', () => {
  it('should multiply each cell by the cell in the same place when it gets two fields', () => {
    expect(
      multiplyFields(
        [
          [2, 0.5],
          [3, 1],
        ],
        [
          [1, 4],
          [0, 0.5],
        ],
      ),
    ).toEqual([
      [2, 2],
      [0, 0.5],
    ]);
  });

  it('should clear a cell when the other field has zero there', () => {
    expect(multiplyFields([[1, 1]], [[0, 1]])).toEqual([[0, 1]]);
  });

  it('should give back an empty field when the fields are empty', () => {
    expect(multiplyFields([], [])).toEqual([]);
  });
});
