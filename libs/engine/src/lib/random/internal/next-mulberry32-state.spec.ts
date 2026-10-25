import { describe, expect, it } from 'vitest';

import { nextMulberry32State } from './next-mulberry32-state';
import type { Mulberry32Cell } from './types/mulberry32-cell';

describe('nextMulberry32State', () => {
  it('should give the state moved on by one step when the state is zero', () => {
    const cell: Mulberry32Cell = { state: 0 };

    const state = nextMulberry32State(cell);

    expect(state).toBe(1_831_565_813);
  });

  it('should keep the moved state in the cell when it is called', () => {
    const cell: Mulberry32Cell = { state: 0 };

    nextMulberry32State(cell);

    expect(cell.state).toBe(1_831_565_813);
  });

  it('should wrap the state round to a signed 32-bit number when it is called twice', () => {
    const cell: Mulberry32Cell = { state: 0 };

    nextMulberry32State(cell);
    const state = nextMulberry32State(cell);

    expect(state).toBe(-631_835_670);
  });
});
