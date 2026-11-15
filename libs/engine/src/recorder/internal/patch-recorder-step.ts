import type { RecorderState } from '../types/recorder-state';

export const patchRecorderStep = (recorder: RecorderState): RecorderState => ({
  ...recorder,
  step: recorder.step + 1,
});
