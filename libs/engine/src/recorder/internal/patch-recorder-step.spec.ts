import { describe, expect, it } from 'vitest';

import { createRecorder } from '../create-recorder';
import type { RecorderState } from '../types/recorder-state';
import { patchRecorderStep } from './patch-recorder-step';

const WORLD_NAME = 'TEST-WORLD';

const REACHED_STEP = 7;

const createSteppedRecorder = (): RecorderState => ({
  ...createRecorder(WORLD_NAME),
  step: REACHED_STEP,
});

describe('patchRecorderStep', () => {
  it('should count one step more when the run steps on', () => {
    const stepped = patchRecorderStep(createSteppedRecorder());

    expect(stepped.step).toBe(REACHED_STEP + 1);
  });

  it('should keep the world name, the inputs and the recording when the run steps on', () => {
    const recorder = createSteppedRecorder();

    const stepped = patchRecorderStep(recorder);

    expect(stepped.worldName).toBe(WORLD_NAME);
    expect(stepped.entries).toBe(recorder.entries);
    expect(stepped.isRecording).toBe(recorder.isRecording);
  });

  it('should leave the recorder it was handed untouched when the run steps on', () => {
    const recorder = createSteppedRecorder();

    patchRecorderStep(recorder);

    expect(recorder).toEqual(createSteppedRecorder());
  });
});
