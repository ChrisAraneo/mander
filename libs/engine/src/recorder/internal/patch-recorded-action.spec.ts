import { describe, expect, it } from 'vitest';

import { createRecorder } from '../create-recorder';
import type { RecorderState } from '../types/recorder-state';
import { patchRecordedAction } from './patch-recorded-action';

const WORLD_NAME = 'TEST-WORLD';

const REACHED_STEP = 7;

const createSteppedRecorder = (): RecorderState => ({
  ...createRecorder(WORLD_NAME),
  step: REACHED_STEP,
});

describe('patchRecordedAction', () => {
  it('should count one step more and record nothing when the clock ticks', () => {
    const patched = patchRecordedAction(createSteppedRecorder(), {
      type: 'TICK',
    });

    expect(patched.step).toBe(REACHED_STEP + 1);
    expect(patched.entries).toEqual([]);
  });

  it('should record the input and stay on the same step when the player acts', () => {
    const patched = patchRecordedAction(createSteppedRecorder(), {
      type: 'JUMP_START',
    });

    expect(patched.step).toBe(REACHED_STEP);
    expect(patched.entries).toEqual([
      { atStep: REACHED_STEP, action: { type: 'JUMP_START' } },
    ]);
  });

  it('should leave the recorder it was handed untouched when an input comes in', () => {
    const recorder = createSteppedRecorder();

    patchRecordedAction(recorder, { type: 'JUMP_START' });
    patchRecordedAction(recorder, { type: 'TICK' });

    expect(recorder).toEqual(createSteppedRecorder());
  });
});
