import type { RecorderState } from './types/recorder-state';

export const createEmptyRecorderState = (): RecorderState => ({
  entries: [],
  step: 0,
  isRecording: true,
});
