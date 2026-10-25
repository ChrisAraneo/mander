import type { RecorderState } from './types/recorder-state';

export const finishRecording = (recorder: RecorderState): RecorderState => ({
  ...recorder,
  isRecording: false,
});
