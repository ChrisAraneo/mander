import { describe, expect, it } from 'vitest';

import { createRecorder } from '../create-recorder';
import type { RecorderState } from '../types/recorder-state';
import { patchRecorderEntries } from './patch-recorder-entries';

const WORLD_NAME = 'TEST-WORLD';

const REACHED_STEP = 7;

const EARLIER_STEP = 2;

const createSteppedRecorder = (): RecorderState => ({
  ...createRecorder(WORLD_NAME),
  step: REACHED_STEP,
  entries: [{ atStep: EARLIER_STEP, action: { type: 'MOVE_LEFT_START' } }],
});

describe('patchRecorderEntries', () => {
  it('should add the input after the ones already recorded when an input comes in', () => {
    const recorded = patchRecorderEntries(createSteppedRecorder(), {
      type: 'JUMP_START',
    });

    expect(recorded.entries).toEqual([
      { atStep: EARLIER_STEP, action: { type: 'MOVE_LEFT_START' } },
      { atStep: REACHED_STEP, action: { type: 'JUMP_START' } },
    ]);
  });

  it('should hold the input alone when nothing was recorded yet', () => {
    const recorded = patchRecorderEntries(createRecorder(WORLD_NAME), {
      type: 'JUMP_START',
    });

    expect(recorded.entries).toEqual([
      { atStep: 0, action: { type: 'JUMP_START' } },
    ]);
  });

  it('should keep the world name and the step the run has reached when an input comes in', () => {
    const recorded = patchRecorderEntries(createSteppedRecorder(), {
      type: 'JUMP_START',
    });

    expect(recorded.worldName).toBe(WORLD_NAME);
    expect(recorded.step).toBe(REACHED_STEP);
  });

  it('should leave the recorder it was handed untouched when an input comes in', () => {
    const recorder = createSteppedRecorder();

    patchRecorderEntries(recorder, { type: 'JUMP_START' });

    expect(recorder).toEqual(createSteppedRecorder());
  });
});
