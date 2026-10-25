import { describe, expect, it } from 'vitest';

import { createRecorder } from './create-recorder';

describe('createRecorder', () => {
  it('should hold no inputs at the first step and be recording when a recorder starts', () => {
    const recorder = createRecorder('TEST-WORLD');

    expect(recorder).toEqual({
      worldName: 'TEST-WORLD',
      entries: [],
      step: 0,
      isRecording: true,
    });
  });

  it('should give a fresh recorder each time when it is asked twice', () => {
    const first = createRecorder('TEST-WORLD');

    const second = createRecorder('TEST-WORLD');

    expect(second).not.toBe(first);
    expect(second.entries).not.toBe(first.entries);
    expect(second).toEqual(first);
  });
});
