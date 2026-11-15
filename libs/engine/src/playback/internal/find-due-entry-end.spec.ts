import { describe, expect, it } from 'vitest';

import type { RecordedAction } from '../../recorder/types/recorded-action';
import { findDueEntryEnd } from './find-due-entry-end';

const ENTRIES: RecordedAction[] = [
  { atStep: 0, action: { type: 'MOVE_RIGHT_START' } },
  { atStep: 0, action: { type: 'JUMP_START' } },
  { atStep: 2, action: { type: 'JUMP_STOP' } },
  { atStep: 2, action: { type: 'SHOOT' } },
  { atStep: 3, action: { type: 'MOVE_RIGHT_STOP' } },
];

describe('findDueEntryEnd', () => {
  it('should step past every input recorded on the step when they come one after another', () => {
    const end = findDueEntryEnd(ENTRIES, 0, 0);

    expect(end).toBe(2);
  });

  it('should step past the inputs of a later step when it starts from them', () => {
    const end = findDueEntryEnd(ENTRIES, 2, 2);

    expect(end).toBe(4);
  });

  it('should step past only the inputs left on the step when it starts part way through them', () => {
    const end = findDueEntryEnd(ENTRIES, 1, 0);

    expect(end).toBe(2);
  });

  it('should stay where it is when the next input was recorded on another step', () => {
    const end = findDueEntryEnd(ENTRIES, 2, 1);

    expect(end).toBe(2);
  });

  it('should stay where it is when there are no inputs left', () => {
    const end = findDueEntryEnd(ENTRIES, 5, 3);

    expect(end).toBe(5);
  });

  it('should stay at the start when nothing was recorded', () => {
    const end = findDueEntryEnd([], 0, 0);

    expect(end).toBe(0);
  });
});
