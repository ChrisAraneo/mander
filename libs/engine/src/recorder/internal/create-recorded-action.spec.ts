import { describe, expect, it } from 'vitest';

import { createRecorder } from '../create-recorder';
import type { RecorderState } from '../types/recorder-state';
import { createRecordedAction } from './create-recorded-action';

const WORLD_NAME = 'TEST-WORLD';

const REACHED_STEP = 7;

const createSteppedRecorder = (): RecorderState => ({
  ...createRecorder(WORLD_NAME),
  step: REACHED_STEP,
});

describe('createRecordedAction', () => {
  it('should stamp the input with the step the run has reached when it is recorded', () => {
    const recorded = createRecordedAction(createSteppedRecorder(), {
      type: 'JUMP_START',
    });

    expect(recorded).toEqual({
      atStep: REACHED_STEP,
      action: { type: 'JUMP_START' },
    });
  });

  it('should stamp the input with step zero when nothing has stepped yet', () => {
    const recorded = createRecordedAction(createRecorder(WORLD_NAME), {
      type: 'INTERACT',
    });

    expect(recorded.atStep).toBe(0);
  });

  it('should leave the recorder it was handed untouched when it stamps an input', () => {
    const recorder = createSteppedRecorder();

    createRecordedAction(recorder, { type: 'JUMP_START' });

    expect(recorder).toEqual(createSteppedRecorder());
  });
});
