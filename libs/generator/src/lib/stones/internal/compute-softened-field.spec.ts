import { times, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeBlurredField } from './compute-blurred-field';
import { computeSoftenedField } from './compute-softened-field';

const SIZE = 41;

const MIDDLE = 20;

const createDot = (): number[][] =>
  times(SIZE, (row) =>
    times(SIZE, (column) => toNumber(row === MIDDLE && column === MIDDLE)),
  );

describe('computeSoftenedField', () => {
  it('should keep the field the same when all of its cells are the same', () => {
    expect(
      computeSoftenedField([
        [1, 1],
        [1, 1],
      ]),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('should blur the field twice when it softens it', () => {
    expect(computeSoftenedField(createDot())).toEqual(
      computeBlurredField(computeBlurredField(createDot())),
    );
  });

  it('should reach farther than one blur when it softens a lone cell', () => {
    expect(computeBlurredField(createDot())[MIDDLE][MIDDLE + 12]).toBe(0);
    expect(
      computeSoftenedField(createDot())[MIDDLE][MIDDLE + 12],
    ).toBeGreaterThan(0);
  });

  it('should give back an empty field when the field is empty', () => {
    expect(computeSoftenedField([])).toEqual([]);
  });
});
