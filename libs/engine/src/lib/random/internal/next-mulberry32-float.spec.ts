import { every, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { nextMulberry32Float } from './next-mulberry32-float';
import type { Mulberry32Cell } from './types/mulberry32-cell';

describe('nextMulberry32Float', () => {
  it('should give the recorded floats in order when the state starts at 42', () => {
    const cell: Mulberry32Cell = { state: 42 };

    const floats = [nextMulberry32Float(cell), nextMulberry32Float(cell)];

    expect(floats).toEqual([0.6011037519201636, 0.44829055899754167]);
  });

  it('should move the state in the cell on when it gives a float', () => {
    const cell: Mulberry32Cell = { state: 42 };

    nextMulberry32Float(cell);

    expect(cell.state).toBe(1_831_565_855);
  });

  it('should give the same float when the state is the same', () => {
    expect(nextMulberry32Float({ state: 7 })).toBe(
      nextMulberry32Float({ state: 7 }),
    );
  });

  it('should give another float when the state is different', () => {
    expect(nextMulberry32Float({ state: 7 })).not.toBe(
      nextMulberry32Float({ state: 8 }),
    );
  });

  it('should give a float when the state is zero', () => {
    expect(nextMulberry32Float({ state: 0 })).toBe(0.26642920868471265);
  });

  it('should keep every float between zero and one when it is called many times', () => {
    const cell: Mulberry32Cell = { state: 7 };

    const floats = times(1000, () => nextMulberry32Float(cell));

    expect(every(floats, (float) => float >= 0 && float < 1)).toBe(true);
  });
});
