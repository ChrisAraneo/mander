import type { RecorderState } from './types/recorder-state';

export const createRecorder = (worldName: string): RecorderState => ({
  worldName,
  entries: [],
  step: 0,
  isRecording: true,
});
