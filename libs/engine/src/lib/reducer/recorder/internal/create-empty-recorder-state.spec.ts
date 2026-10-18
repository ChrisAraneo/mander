import { describe, expect, it } from 'vitest';

import { createEmptyRecorderState } from './create-empty-recorder-state';

describe('createEmptyRecorderState', () => {
  it('should hold no inputs at the first step and be recording when a recorder starts', () => {
    const state = createEmptyRecorderState();

    expect(state).toEqual({ entries: [], step: 0, isRecording: true });
  });

  it('should give a fresh state each time when it is asked twice', () => {
    const first = createEmptyRecorderState();

    const second = createEmptyRecorderState();

    expect(second).not.toBe(first);
    expect(second.entries).not.toBe(first.entries);
    expect(second).toEqual(first);
  });
});
